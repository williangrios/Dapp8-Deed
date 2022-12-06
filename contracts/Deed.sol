
pragma solidity ^0.8.17;

contract Deed{
    address public lawyer;
    address payable public beneficiary;
    uint public earliest;

    //fromNow in seconds
    constructor(address _lawyer, address payable _beneficiary, uint fromNow) payable{
        lawyer  = _lawyer;
        beneficiary = _beneficiary;
        earliest = block.timestamp + fromNow;
    }

    function balanceOf() public view returns (uint){
        return address(this).balance;
    }

    function withdraw() public {
        require(msg.sender == lawyer, "Only Lawyer allowed");        
        require(block.timestamp >= earliest, "Too early");
        beneficiary.transfer(address(this).balance);
    }

}