pragma solidity ^0.4.0;

import "./ERC20.sol";
import "./crowdfund.sol";

/* 
    ICO Machine creates new token contracts and launches sales
*/

contract IcoMachine {
    address public owner;

    struct Ico {
        address tokenAddress;
        address saleAddress;
        uint256 initialSupply; 
        string tokenName;
        uint8 decimals;
        string symbol;
    }

    mapping (address => Ico) public tokens; // map creator address to token address
                                                // right now only one token per creator. fix later.

    function IcoMachine() {
        owner = msg.sender;
    }

    function createToken( 
        uint256 initialSupply, 
        string tokenName,
        uint8 decimals,
        string symbol ) 
    {
        address newToken = new CoinGenToken(initialSupply, tokenName, decimals, symbol);
        tokens[msg.sender].tokenAddress = newToken;
        tokens[msg.sender].initialSupply = initialSupply;
        tokens[msg.sender].tokenName = tokenName;
        tokens[msg.sender].decimals = decimals;
        tokens[msg.sender].symbol = symbol;
    } 

    function createSale(
        uint fundingGoal,
        uint etherCostOfEachToken )
    {
        if (tokens[msg.sender].tokenAddress == 0x0) throw;
        address tokenAddress = tokens[msg.sender].tokenAddress;
        address saleAddress = new Crowdsale(msg.sender, fundingGoal, etherCostOfEachToken, tokenAddress);
        tokens[msg.sender].saleAddress = saleAddress;   
    }
 
    function kill() 
    { 
        if (msg.sender == owner)
            suicide(owner);  // kills this contract and sends remaining funds back to creator
    }

}
