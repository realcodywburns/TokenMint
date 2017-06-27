pragma solidity ^0.4.11;


// Managed registery
// a registery for tracking items that an admin can prune as required
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
  function owned () {owner = msg.sender;}
  address owner;
  modifier onlyOwner {
          if (msg.sender != owner)
              throw;
          _;
          }
  }
contract priced {
    modifier costs(uint price) {
        if (msg.value >= price) {
            _;
        }
    }
}
contract smartmanager is priced, owned {

//Global vars
  enum modActions { add, del, change, reprice, rename } // 0,1,2,3,4
  modActions choice;
  string public nameTag;                // public contract name
  uint64 aCount;                         // running account check
  uint public pendingReturns;           //  returns amount available for withdrawl
  uint8 public adminCount;               // check count of admins
  uint public price;                    // the cost of each ticket is n ether.
  struct admin {
    address adminAddr;                  // store an admins address
   }

   struct token{
      address tAddr;  // address of token contract
      address tSale;  // address to the crowdsale
      string tName;   // human readable name of token
      string tSymbol; // token symbol
      uint tDecimal;  // how many decimal places
      string tType;   // the type of token
      string tIcon;   // url of image file for token if any
      string tURL;    // team website
      string tBlerb;   // about token
      uint dateChanged;     // last changed on
      address changedBy;    // last changed by
      string changeReason;  // notes on change
    }




//mapping
  mapping(uint => token) tokens;
  mapping(uint => admin) adminList;

//events
  event newToken(address tAddr, address tSale, string tName, string tSymbol);
  event modToken(address modName, address tAddr, address tSale, string tName, string tSymbol);
  event delToken(address modName, string tokenName);

// functions

// public functions

// anyone can add a token to the registry if the price is paid

function register(address _tAddr, address _tSale, string _tName, string _tSymbol, uint _tDecimal, string _tType, string _tIcon, string _tUrl, string _tBlerb) public payable costs(price){
    logCoin(_tAddr,_tSale,_tName,  _tSymbol, _tDecimal,  _tType, _tIcon, _tUrl, _tBlerb);
}

function  logCoin(address _tAddr, address _tSale, string _tName, string _tSymbol, uint _tDecimal, string _tType, string _tIcon, string _tUrl, string _tBlerb) internal {
    uint id = aCount++;
    token t = tokens[id];                                   // assigns the incoming token to the next available address
    t.tAddr = _tAddr;                                       // address of the main token contract
    t.tSale = _tSale;                                       // address of the crowd sale
    t.tName = _tName;                                       // human readable name of token
    t.tSymbol = _tSymbol;                                   // tickertape symbol
    t.tDecimal = _tDecimal;                                 // how many places
    t.tType =  _tType;                                      // erc20 or erc223
    t.tIcon = _tIcon;                                       // should be a url to the token image
    t.tURL = _tUrl;
    t.tBlerb = _tBlerb;
    t.dateChanged = now;                                    // updates the modlog
    pendingReturns += msg.value;                            // increases the owners balance
    newToken(_tAddr, _tSale, _tName,  _tSymbol);            // announce token logged with an event
}
// only owner

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

function modAdmin(address _admin, modActions _action, uint8 _index) onlyOwner{
//options are  add,  del, change
    if (_action == modActions.add){
      uint id = adminCount++;
      adminList[id].adminAddr = _admin;
    }
    if (_action == modActions.del){
      delete adminList[_index].adminAddr;
      adminCount = adminCount -1;
    }
    if (_action == modActions.change){
      adminList[_index].adminAddr = _admin;
    }
  }


// admin managed functions
  //manage the list in case something goes wrong (1)add (2)delete (3)change (4) ticketPrice (5) change the nametag
function modCategory(
      modActions _action,
      uint _index,
      address _tAddr,
      address _tSale,
      string _tName,
      string _tSymbol,
      uint _tDecimal,
      string _tType,
      string _tIcon,
      string _tUrl,
      string _tBlerb,
      uint _reprice,
      string _newName
      ) onlyAdmin {
//this is the function adds contracts from the list for free
     if (_action == modActions.add){
     logCoin(_tAddr,_tSale, _tName,  _tSymbol, _tDecimal,  _tType, _tIcon,_tUrl, _tBlerb);
       }


//this is the function removes contracts from the list and saves the meta data of who pulled it
     if (_action == modActions.del){
     delete tokens[_index];
     // delToken(msg.sender, t.tName);                   // announce that the token is being killed
     // delete t.tAddr;                                  // zeroize all fields
     // delete t.tSale;
     // delete t.tName;
     // delete t.tSymbol;
     // delete t.tDecimal;
     // delete t.tType;
     // delete t.tIcon;
     // delete t.dateChanged;
     // t.dateChanged = now;                             // update the date that the change happened
     //t.changedBy = msg.sender;                        // name the person who changed it
       }

//this is the function allows to change a specific field in a contract from the list, TODO add all fields

//this is the function sets the listing price
    if (_action == modActions.reprice){
      price = _reprice;
    }

//this is the function labels the Manager contract , may not be needed unless you are hosting more than one reg contract and need to identify them quickly
    if (_action == modActions.rename){
      nameTag = _newName;
    }
}



//Outputs

function Count() constant returns (uint64){
return aCount;
}

function modList(uint8 _index) constant returns (address){
  return adminList[_index].adminAddr;
  }

function returnCheck() constant returns (uint){
  return pendingReturns;
}

function ownerCheck() constant returns(address){
  return owner;
}

function getArray(uint _index) constant returns (address,address,string,string,uint,string,string,string,string)  // NOTE 3 see below
    {
        token t = tokens[_index];
    	return (t.tAddr,t.tSale,t.tName,t.tSymbol, t.tDecimal, t.tType,t.tIcon, t.tURL,t.tBlerb);
    }

function getQuick(uint _index) constant returns (address, string, string, string)
    {
        token t = tokens[_index];
    	return (t.tAddr, t.tName, t.tSymbol, t.tIcon);
    }

//modifiers
modifier onlyAdmin{
      uint adminCheck = 0;
      for(uint i; i < aCount; i ++){
        if (msg.sender == adminList[i].adminAddr){adminCheck = 1;}
        if (adminCheck != 1){throw;  _;}
        }
    }

//safety switches consider removing for production
//clean up after contract is no longer needed

function kill() public onlyOwner {selfdestruct(owner);}

}
