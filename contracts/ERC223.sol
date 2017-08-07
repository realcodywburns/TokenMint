pragma solidity ^0.4.9;

import "./safeMath.sol";

 /* Receiver must implement this function to receive tokens
 *  otherwise token transaction will fail
 */
 
 contract ContractReceiver {
    function tokenFallback(address _from, uint _value, bytes _data){
      //Incoming transaction code here
    }
}
 
 /* Dexaran Basic Token */
/* https://github.com/Dexaran/ERC23-tokens/blob/master/token/ERC223/ERC223BasicToken.sol */
contract Token {
    using SafeMath for uint;

    /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;
  
    string public standard = 'Token 0.223';
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    event Transfer(address indexed from, address indexed to, uint value);

    /* Initializes contract with initial supply tokens to the creator of the contract */
    function Token(
        uint256 initialSupply,
        string tokenName,
        uint8 decimalUnits,
        string tokenSymbol
        ) {
        balanceOf[msg.sender] = initialSupply;              // Give the creator all initial tokens
        totalSupply = initialSupply;                        // Update total supply
        name = tokenName;                                   // Set the name for display purposes
        symbol = tokenSymbol;                               // Set the symbol for display purposes
        decimals = decimalUnits;                           // Amount of decimals for display purposes
    }


    // Function that is called when a user or another contract wants to transfer funds .
    function transfer(address to, uint value, bytes data) {
        // Standard function transfer similar to ERC20 transfer with no _data .
        // Added due to backwards compatibility reasons .
        uint codeLength;

        assembly {
            // Retrieve the size of the code on target address, this needs assembly .
            codeLength := extcodesize(to)
        }

        balanceOf[msg.sender] = balanceOf[msg.sender].sub(value);
        balanceOf[to] = balanceOf[to].add(value);
        if(codeLength>0) {
            ContractReceiver receiver = ContractReceiver(to);
            receiver.tokenFallback(msg.sender, value, data);
        }
        Transfer(msg.sender, to, value, data);
    }

    // Standard function transfer similar to ERC20 transfer with no _data .
    function transfer(address to, uint value) {
        uint codeLength;

        assembly {
            // Retrieve the size of the code on target address, this needs assembly .
            codeLength := extcodesize(to)
        }

        balanceOf[msg.sender] = balanceOf[msg.sender].sub(value);
        balanceOf[to] = balanceOf[to].add(value);
        if(codeLength>0) {
            ContractReceiver receiver = ContractReceiver(to);
            bytes memory empty;
            receiver.tokenFallback(msg.sender, value, empty);
        }
        Transfer(msg.sender, to, value, empty);
    }
}
