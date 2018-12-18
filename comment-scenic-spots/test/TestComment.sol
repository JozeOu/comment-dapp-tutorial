pragma solidity ^0.4.17;

import "truffle/Assert.sol";   // 引入的断言
import "truffle/DeployedAddresses.sol";  // 用来获取被测试合约的地址
import "../contracts/Comment.sol";      // 被测试合约

contract TestComment {
  Comment myComment = Comment(DeployedAddresses.Comment());

  // 评论测试用例
  function testUserCanCommentScenicSpot() public {
    uint returnedId = myComment.comment(2);

    uint expected = 2;
    Assert.equal(returnedId, expected, "Comment of ID 2 should be recorded.");
  }

  // 评论者测试用例
  function testGetCommenterAddressById() public {
    // 期望评论者的地址就是本合约地址，因为交易是由测试合约发起交易，
    address expected = this;
    address commenter = myComment.commenters(2);
    Assert.equal(commenter, expected, "Commenter of ID 2 should be recorded.");
  }

  // 测试所有评论者
  function testGetCommenterAddressByIdInArray() public {
    // 评论者的地址就是本合约地址
    address expected = this;
    address[4] memory commenters = myComment.getCommenters();
    Assert.equal(commenters[2], expected, "Commenter of ID 2 should be recorded.");
  }
}