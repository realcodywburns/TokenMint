pragma solidity ^0.4.0;

import "./ERC223.sol";
import "./crowdsale.sol";
import '././DexNS_Interface.sol';

/* 
    ICO Machine creates new token contracts and launches sales
*/

contract IcoMachine {
    address public owner;
    DexNS_Abstract_Interface dexns = DexNS_Abstract_Interface(0x101f1920e4cd9c7e2af056e2cb1954d0dd9647b9); // <= DexNS frontend

    struct Ico {
        address tokenAddress;
        address saleAddress;
        uint256 initialSupply; 
        string tokenName;
        uint8 decimals;
        string symbol;
    }

    mapping (address => uint) public tokenIndex; // map creator address to token count
    mapping (address => mapping(uint => Ico)) public tokens; // map creator address to tokens

    event TokenCreation(address creator, address token, uint index);
    event CrowdsaleCreation(address creator, address crowdsale, uint index);

    function IcoMachine() {
        owner = msg.sender;
    }

    function createToken( 
        uint256 initialSupply, 
        string tokenName,
        uint8 decimals,
        string symbol )
    {
        assert(dexns.registerAndUpdateName(symbol, msg.sender, msg.sender, "-ETC", false, false));
        address newToken = new Token(initialSupply, tokenName, decimals, symbol);
        uint count = tokenIndex[msg.sender];
        tokens[msg.sender][count] = Ico({
            tokenAddress: newToken,
            saleAddress: 0x0,
            initialSupply: initialSupply,
            tokenName: tokenName,
            decimals: decimals,
            symbol: symbol
            });

        tokenIndex[msg.sender] += 1;
        TokenCreation(msg.sender, newToken, count);
    } 

    /* total supply must be greater than funding goal */
    function createSale(
        uint fundingGoal,
        uint costOfEachToken,
        uint256 premine,
        uint index )
    {
        assert(tokens[msg.sender][index].tokenAddress != 0x0);
        address tokenAddress = tokens[msg.sender][index].tokenAddress;
        address saleAddress = new Crowdsale(msg.sender, fundingGoal, costOfEachToken, tokenAddress);
        tokens[msg.sender][index].saleAddress = saleAddress;
        Token tokenReward = Token(tokenAddress);
        tokenReward.transfer(msg.sender, premine); 
        // Transfer tokens to sale address
        tokenReward.transfer(saleAddress, tokens[msg.sender][index].initialSupply - premine);

        CrowdsaleCreation(msg.sender, saleAddress, index);
    }
 
    function kill() 
    { 
        if (msg.sender == owner)
            suicide(owner);  // kills this contract and sends remaining funds back to creator
    }

}
