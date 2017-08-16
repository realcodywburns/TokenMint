pragma solidity ^0.4.0;

import "./ERC223.sol";
import "./crowdsale.sol";

/* 
    ICO Machine creates new token contracts and launches sales
*/

contract IcoMachine {
    address public owner;
    uint64 public count;

    struct Ico {
        address tokenAddress;
        address saleAddress;
        uint256 initialSupply; 
        string tokenName;
        uint8 decimals;
        string symbol;
    }

    mapping (address => Ico) public tokens; // map creator address to token address
    mapping (uint => Ico) public icos; // list of everything created

    event TokenCreation(address token);
    event CrowdsaleCreation(address crowdsale);

    function IcoMachine() {
        owner = msg.sender;
    }

    function createToken( 
        uint256 initialSupply, 
        string tokenName,
        uint8 decimals,
        string symbol ) 
    {
        address newToken = new Token(initialSupply, tokenName, decimals, symbol);
        tokens[msg.sender].tokenAddress = newToken;
        tokens[msg.sender].initialSupply = initialSupply;
        tokens[msg.sender].tokenName = tokenName;
        tokens[msg.sender].decimals = decimals;
        tokens[msg.sender].symbol = symbol;

        TokenCreation(newToken);
    } 

    function createSale(
        uint fundingGoal,
        uint costOfEachToken,
        uint256 premine )
    {
        assert(tokens[msg.sender].tokenAddress != 0x0);
        address tokenAddress = tokens[msg.sender].tokenAddress;
        address saleAddress = new Crowdsale(msg.sender, fundingGoal, costOfEachToken, tokenAddress);
        tokens[msg.sender].saleAddress = saleAddress;
        icos[count] = tokens[msg.sender];
        count++;
        Token tokenReward = Token(tokenAddress);
        tokenReward.transfer(msg.sender, premine); 
        // Transfer tokens to sale address
        tokenReward.transfer(saleAddress, tokens[msg.sender].initialSupply - premine);

        CrowdsaleCreation(saleAddress);
    }
 
    function kill() 
    { 
        if (msg.sender == owner)
            suicide(owner);  // kills this contract and sends remaining funds back to creator
    }

}
