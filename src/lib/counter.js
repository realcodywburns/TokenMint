import Web3 from 'web3';
import rpc from './rpc.js';
import { IcoMachineAddress } from './contract.js';

var web3 = new Web3(new Web3.providers.HttpProvider(rpc.NodeApi));

var abi1 = [{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"tokenIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"tokens","outputs":[{"name":"tokenAddress","type":"address"},{"name":"saleAddress","type":"address"},{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"decimals","type":"uint8"},{"name":"symbol","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"decimals","type":"uint8"},{"name":"symbol","type":"string"}],"name":"createToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"fundingGoal","type":"uint256"},{"name":"costOfEachToken","type":"uint256"},{"name":"premine","type":"uint256"},{"name":"index","type":"uint256"}],"name":"createSale","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"creator","type":"address"},{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"index","type":"uint256"}],"name":"TokenCreation","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"creator","type":"address"},{"indexed":false,"name":"crowdsale","type":"address"},{"indexed":false,"name":"index","type":"uint256"}],"name":"CrowdsaleCreation","type":"event"}];

var contractICO = web3.eth.contract(abi1).at(IcoMachineAddress);


/* Get events */
var tokenEvent = contractICO.TokenCreation({'type':'mined'},{fromBlock: 0, toBlock: 'latest'});
var icoEvent = contractICO.CrowdsaleCreation({'type':'mined'},{fromBlock: 0, toBlock: 'latest'});

/* return Counts */
export const getETC = tokenEvent.watch(function(error, data){
  if(!error){
  console.log(data)
  }else {
      console.log(error);
  }
  return data;}
);


export const icoCount = icoEvent.watch(function(error, data){
  if(!error){
  console.log(data)
  }else {
      console.log(error);
  }
  return data;}
);
