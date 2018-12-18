pragma solidity ^0.4.17;

contract Comment {

  address[4] public commenters;  // 保存评论者的地址

    // 评论景点
  function comment(uint scenicSpotId) public returns (uint) {
    require(scenicSpotId >= 0 && scenicSpotId <= 3);  // 确保id在数组长度内

    commenters[scenicSpotId] = msg.sender;        // 保存调用者地址 
    return scenicSpotId;
  }

  // 返回评论者的地址
  function getCommenters() public view returns (address[4]) {
    return commenters;
  }
}