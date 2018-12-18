App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../scenicspots.json', function(data) {
      var scenicSpotsRow = $('#scenicSpotsRow');
      var scenicSpotTemplate = $('#scenicSpotTemplate');

      for (i = 0; i < data.length; i ++) {
        scenicSpotTemplate.find('.panel-title').text(data[i].name);
        scenicSpotTemplate.find('img').attr('src', data[i].picture);
        scenicSpotTemplate.find('.pet-breed').text(data[i].about);
        scenicSpotTemplate.find('.pet-age').text(data[i].grade);
        scenicSpotTemplate.find('.pet-location').text(data[i].location);
        scenicSpotTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        scenicSpotsRow.append(scenicSpotTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Is there an injected web3 instance?
	if (typeof web3 !== 'undefined') {
		App.web3Provider = web3.currentProvider;
	} else {
		// If no injected web3 instance is detected, fall back to Ganache
		App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
	}
	web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    // 加载Comment.json，保存了Comment的ABI（接口说明）信息及部署后的网络(地址)信息，它在编译合约的时候生成ABI，在部署的时候追加网络信息
	$.getJSON('Comment.json', function(data) {
		// 用Comment.json数据创建一个可交互的TruffleContract合约实例。
		var CommentArtifact = data;
		App.contracts.Comment = TruffleContract(CommentArtifact);

		// Set the provider for our contract
		App.contracts.Comment.setProvider(App.web3Provider);

		// Use our contract to retrieve and mark the commented scenic spots
		return App.markCommented();
	});

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleComment);
  },

  markCommented: function(commenters, account) {
    var commentInstance;

	App.contracts.Comment.deployed().then(function(instance) {
		commentInstance = instance;

		// 调用合约的getCommenters(), 用call读取信息不用消耗gas
		return commentInstance.getCommenters.call();
	}).then(function(commenters) {
		for (i = 0; i < commenters.length; i++) {
		  if (commenters[i] !== '0x0000000000000000000000000000000000000000') {
			$('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
		  }
		}
	}).catch(function(err) {
		console.log(err.message);
	});
  },

  handleComment: function(event) {
    event.preventDefault();

    var scenicSpotId = parseInt($(event.target).data('id'));

    var commentInstance;

	// 获取用户账号
	web3.eth.getAccounts(function(error, accounts) {
		if (error) {
		  console.log(error);
		}
	  
		var account = accounts[0];
	  
		App.contracts.Comment.deployed().then(function(instance) {
		  commentInstance = instance;
	  
		  // 发送交易评论景点
		  return commentInstance.comment(scenicSpotId, {from: account});
		}).then(function(result) {
		  return App.markCommented();
		}).catch(function(err) {
		  console.log(err.message);
		});
	});
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
