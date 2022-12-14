pragma solidity ^0.4.26;
contract Lottery{
    address public manager;
    address[] public players;
    address public winner;
    constructor() public {
        manager = msg.sender;
    }
    function enter() public payable{
        require(msg.value>0.01 ether);
        players.push(msg.sender);
    }
    function random() private view returns (uint){
         //  return uint(keccak256(block.difficulty,now,players));
        return uint(keccak256(abi.encodePacked(block.difficulty,now,players)));
    }
    function pickWinner() public restrictedOnlyForManager{
      
        uint index = random() % players.length;
        players[index].transfer(address(this).balance);
        winner = players[index];
        players = new address[](0);
    }
    modifier restrictedOnlyForManager(){
          require(msg.sender==manager);
          _;
    }

    function getPlayers() public view returns (address[]){
        return players;
    }
}