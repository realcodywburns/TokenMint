 contract DexNS_Abstract_Interface {
     function name(string)    constant returns (bytes32);
     function getName(string) constant returns (address _owner, address _associated, string _value, uint _end, bytes32 _sig);
     
     function ownerOf(string)   constant returns (address);
     function addressOf(string) constant returns (address);
     function valueOf(string)   constant returns (string);
     function endtimeOf(string) constant returns (uint);
     function updateName(string, string);
     function updateName(string, address);
     function updateName(string, address, string);
     function registerName(string) payable returns (bool);
     function registerAndUpdateName(string, address, address, string, bool, bool) payable returns (bool);
     function changeNameOwner(string, address, bytes);
     function hideNameOwner(string);
     function extendNameBindingTime(string) payable;
     function appendNameMetadata(string, string);
 }
