pragma solidity ^0.4.11;


// Managed registry
// a registry for tracking items that an admin can prune as required
// @authors:
// Cody Burns <dontpanic@codywburns.com>
// license: Apache 2.0

// usage:
//
// This managing contract is a general purpose token. Users can register the token address, symbol. decimal, type, and icon location(url for a set fee)
// It needs an owner who can assign Managers. Managers can edit token details. Output is all meta token data by item.
// still needs: improved item editing management, test framework, access levels for admins, all outputs for meta data, externalize admin to onlyAdmin contract
// submit pr and issues to https://github.com/realcodywburns/ETC-public-Works/edit/master/public-registry/manager.sol


contract owned{
  address public owner;

  function owned () {
    owner = msg.sender;
  }

  modifier onlyOwner {
    if (msg.sender != owner) {
        _;
    }
  }
}

contract priced {
  modifier costs(uint price) {
    if (msg.value < price) {
        _;
    }
  }
}

contract Registry is priced, owned {

  enum modActions { add, del, change, reprice }
  uint64 public regCount;                         // running account check
  uint public pendingReturns;           //  returns amount available for withdrawl
  uint8 public adminCount;               // check count of admins
  uint public price;                    // the cost of each ticket is n ether.

  struct Token{
      address tokenAddress;  // address of token contract
      address saleAddress;  // address to the crowdsale
      string tokenName;   // human readable name of token
      string symbol; // token symbol
      uint8 decimals;  // how many decimal places
      string standard;   // token standard
      string iconUrl;   // url of image file for token if any
      string siteUrl;    // team website
      string blerb;   // about token
      uint dateChanged;     // last changed on
      address changedBy;    // last changed by
      string changeReason;  // notes on change
  }

  //mapping
  mapping(uint => Token) public tokens;
  mapping(uint8 => address) public admins;

  //events
  event newToken(address tokenAddress, address saleAddress, string tokenName, string symbol);
  event modToken(address modName, address tokenAddress, address saleAddress, string tokenName, string symbol);
  event delToken(address modName, string tokenName);


  // anyone can add a token to the registry if the price is paid
  function register(    
      address _tokenAddress,
      address _saleAddress,
      string _tokenName,
      string _symbol,
      uint8 _decimals,
      string _standard,
      string _iconUrl,
      string _siteUrl,
      string _blerb ) public payable costs(price) 
  {
      logCoin(msg.sender, _tokenAddress, _saleAddress, _tokenName, _symbol, _decimals, _standard, _iconUrl, _siteUrl, _blerb);
  }

  function logCoin(
      address _sender,
      address _tokenAddress,
      address _saleAddress,
      string _tokenName,
      string _symbol,
      uint8 _decimals,
      string _standard,
      string _iconUrl,
      string _siteUrl,
      string _blerb  ) internal 
  {
      uint id = regCount++;
      tokens[id] = Token({                            // assigns the incoming token to the next available address
        tokenAddress: _tokenAddress,                  // address of the main token contract
        saleAddress: _saleAddress,                    // address of the crowd sale
        tokenName: _tokenName,                        // human readable name of token
        symbol: _symbol,                              // tickertape symbol
        decimals: _decimals,                          // how many places
        standard: _standard,                          // erc20 or erc223
        iconUrl: _iconUrl,                            // should be a url to the token image
        siteUrl: _siteUrl,
        blerb: _blerb,
        dateChanged: now,
        changedBy: _sender,
        changeReason: ""
      });
      pendingReturns += msg.value;                    // increases the owners balance
      newToken(_tokenAddress, _saleAddress, _tokenName, _symbol);  // announce token logged with an event
  }

  //only owner can get the funds stored on the contract
  function withdraw() onlyOwner returns (bool) {
    var amount = pendingReturns;
    if (amount > 0) {
      pendingReturns = 0;
      if (!msg.sender.send(amount)) {
            pendingReturns = amount;
            return false;
        }
    }
    return true;
  }

  // only the owner can add and remove the admins
  function modAdmin(address _admin, modActions _action, uint8 _index) onlyOwner {
      //options are  add,  del, change
      if (_action == modActions.add){
        uint8 id = adminCount++;
        admins[id] = _admin;
      }
      if (_action == modActions.del){
        delete admins[_index];
        adminCount = adminCount - 1;
      }
      if (_action == modActions.change){
        admins[_index] = _admin;
      }
  }


  // admin managed functions
  //manage the list in case something goes wrong (1)add (2)delete (3)change (4) ticketPrice
  function modRegister(
      address _tokenAddress,
      address _saleAddress,
      string _tokenName,
      string _symbol,
      uint8 _decimals,
      string _standard,
      string _iconUrl,
      string _siteUrl,
      string _blerb ) onlyAdmin 
  {
    //this is the function adds contracts from the list for free
     logCoin(msg.sender, _tokenAddress, _saleAddress, _tokenName, _symbol, _decimals, _standard, _iconUrl, _siteUrl, _blerb);
  }

  function modDelete (uint _index) onlyAdmin {
     delete tokens[_index];
  }

  function modReprice (uint _reprice) onlyAdmin {
     price = _reprice;
  }

  //modifiers
  modifier onlyAdmin {
    bool adminCheck = false;
    for(uint8 i; i < adminCount; i ++){
      if (msg.sender == admins[i]){ 
          adminCheck = true; 
      }
    }
    if (!adminCheck) {
        _;
    }
  }

  //safety switches consider removing for production
  //clean up after contract is no longer needed
  function kill() public onlyOwner {selfdestruct(owner);}

}
