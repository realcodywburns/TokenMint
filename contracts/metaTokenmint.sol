pragma solidity ^0.4.11;


// Managed registery
// a registery for tracking items that an admin can prune as required
// @authors:
// Cody Burns <dontpanic@codywburns.com>
// license: Apache 2.0

// usage:
// NOT PRODUCTION READY! DO NOT USE THIS FOR REAL WORLD YET! (or do it, works .....okay)
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

contract versionManager is owned {

//Global vars
  uint aCount;                          // running account check
  uint kCount;                          //count of contract changes
  uint public adminCount;               // check count of admins
  
  struct admin {
    address adminAddr;                  // store an admins address
    string aName;                       // assign a human readable name to an admin
   }

  struct kontract{
    address token;  // address of token contract
    address crowdfund;  // address to the crowdsale
    address icoMachine;
    address registry;
    }

    address newVersion;
    bool isLatest = true;
    
//mapping
  mapping(uint => kontract) kontracts;
  mapping(uint => admin) adminList;

//events
  event newKontracts(address T, address C, string IM, string R);
  
// functions

// public functions
//prevent funding
function (){
    throw;
}

// only owner
// only the owner can add and remove the admins
function modAdmin(address _admin, uint _action, uint _index) onlyOwner{
//options are 1 add, 2 del, 3 mod
    if (_action == 1){
      adminCount += 1;
      uint id = adminCount;
      adminList[id].adminAddr = _admin;
    }
    if (_action == 2){
      delete adminList[_index].adminAddr;
      adminCount = adminCount -1;
    }
    if (_action == 3){
      adminList[_index].adminAddr = _admin;
    }
  }

// admin managed functions
// update reference contracts
function update(address _token,address _crowd,address _icomachine,address _registry) onlyAdmin {
    uint id = kCount;
    kontract k = kontracts[id];
    k.token = _token;
    k.crowdfund= _crowd;
    k.icoMachine= _icomachine; 
    k.registry = _registry;
    kCount +=1;
}

function supersede(address _newcontract) onlyAdmin{
    newVersion = _newcontract;
    isLatest = false;
}


//Outputs

function chkVersion() returns (bool, address){
    return (isLatest,newVersion);
}

function getArray(uint _index) constant returns (address,address,address, address) {
        kontract k = kontracts[_index];
    	return (k.token, k.crowdfund, k.icoMachine, k.registry);
    }


//modifiers
modifier onlyAdmin{
      uint adminCheck = 0;
      for(uint i; i < aCount; i ++){
        if (msg.sender == adminList[i].adminAddr){adminCheck = 1;}
        if (adminCheck != 1){_;}
        }
    }

//safety switches consider removing for production
//clean up after contract is no longer needed

function kill() public onlyOwner {selfdestruct(owner);}

}
