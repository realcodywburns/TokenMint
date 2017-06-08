import Immutable from 'immutable';
import { rpc } from '../lib/rpc';
import { generateTx } from '../lib/transaction';
import { functionToData, dataToParams } from '../lib/convert';


const IcoMachineAddress = "0x26c243b8a4a460a9bb20f3afcf127fa7dd764cfa";

const CreateTokenFunc = Immutable.fromJS({
    name:'createToken',
    inputs:[{ name:'initialSupply', type:'uint256' },
            { name:'tokenName', type:'string' },
            { name:'decimals', type:'uint8' },
            { name:'symbol', type:'string' }]
    });

const CreateSaleFunc = Immutable.fromJS({
    name:'Crowdsale',
    inputs:[{ name:'fundingGoal', type:'uint' },
            { name:'etherCostOfEachToken', type:'uint' }]
    });

const TokensFunc = Immutable.fromJS({
    name:'tokens',
    inputs:[{ name: '', type: 'address' }],
    outputs:[{name:"tokenAddress","type":"address"},
            {name:"saleAddress","type":"address"},
            {name:"initialSupply","type":"uint256"},
            {name:"tokenName","type":"string"},
            {name:"decimals","type":"uint8"},
            {name:"symbol","type":"string"}]
})

const initialTx = {
    to: IcoMachineAddress,
    value: 0,
    gasLimit: null,
    gasPrice: null,
    nonce: null,
    data: '0x',
};

export function readTokens(wallet) {
    return (dispatch) => {
        const data = functionToData(TokensFunc, { '': wallet.getAddressString() });
        return rpc.call("eth_call", [{ 
            to: IcoMachineAddress,
            data: data,
        }]).then((result) => {
            console.log(result);
            var outputs = dataToParams(TokensFunc, result);
            if (outputs.saleAddress)
                readCrowdsale(outputs.saleAddress);
            return result;
        })
    }
}
    

export function readCrowdsale(address) {
/**** port this over. asspain.
var amountRaisedHex = "0x7b3e5e7b";
        var beneficiaryHex = "0x38af3eed"; //beneficiary()
        var fundingGoalHex = "0x7a3a0e84"; //fundingGoal()
        var priceHex = "0xa035b1fe"; //price()
        var tokenRewardHex = "0x6e66f6e9"; //tokenReward()
        var balanceOfHex = "0x70a08231"; //balanceOf(address)
        var crowdsaleTypes = [
            {"sig": amountRaisedHex, "type": "uint", "name": "amountRaised"},
            {"sig": beneficiaryHex, "type": "address", "name": "beneficiary"},
            {"sig": fundingGoalHex, "type": "uint", "name": "fundingGoal"},
            {"sig": priceHex, "type": "uint", "name": "tokenPrice"},
            {"sig": tokenRewardHex, "type": "address", "name": "tokenReward"}
        ]
        crowdsaleTypes.map(function(k) {
            var crowdCall = ethFuncs.getDataObj(addr, k.sig, []);
            ajaxReq.getEthCall(crowdCall, function (data) {
                if (!data.error) {
                    var decoded = ethUtil.solidityCoder.decodeParams([k.type], data.data.replace('0x', ''));
                    if ((k.name == "fundingGoal") || (k.name == "tokenPrice") || (k.name == "amountRaised"))
                        $scope.crowdsale[k.name] = etherUnits.toEther(decoded[0],'wei');
                    else
                        $scope.crowdsale[k.name] = decoded[0];
                    if (k.name == "beneficiary") $scope.readOwnerToken(decoded[0]);
                } else throw data.msg;
            });
        })
***/

}

export function estimateTokenGas(token, wallet) {
    return (dispatch) => {
        const data = functionToData(CreateTokenFunc, 
            { initialSupply: token.totalSupply || 0, 
            tokenName: token.token || "elaine", 
            decimals: token.decimals,
            symbol: token.symbol });
        return rpc.call("eth_estimateGas", [{
            from: wallet.getAddressString(),
            to: IcoMachineAddress,
            data: data,
        }]).then((result) => {
            console.log(result);
            return result;
        });
    }
}

export function estimateIcoGas(ico, wallet) {
    const addr =  wallet.getAddressString();
    return (dispatch) => {
        const data = functionToData(CreateSaleFunc, 
            { fundingGoal: ico.fundingGoal,
                etherCostOfEachToken: ico.price });
        return rpc.call("eth_estimateGas", [{
            from: addr,
            to: IcoMachineAddress,
            data: data,
        }]).then((result) => {
            console.log(result);
            return result;
        });
    }
}

export function generateTokenTransaction(token, wallet) {
    const addr = wallet.getAddressString();
    const data = functionToData(CreateTokenFunc, 
            { initialSupply: token.totalSupply || 0, 
            tokenName: token.token || "elaine", 
            decimals: token.decimals,
            symbol: token.symbol });
    const tx = Object.assign(initialTx, { 
        gasLimit: token.gasLimit,
        data: data,
        from: addr });
    return (dispatch, getState) => {
        const transaction = getState().transaction;
        if (!transaction.get('busy')) {
            tx.gasPrice = transaction.get('data').get('gasPrice');
            tx.nonce = transaction.get('data').get('nonce');
        }
        return generateTx(tx, wallet.getPrivateKey()).then((result) => {
            dispatch({
                type: 'TRANSACTION/GENERATE',
                raw: result.rawTx,
                signed: result.signedTx,
            });
            return result;
        });
    }
}

export function generateIcoTransaction(ico, wallet) {
    const addr = wallet.getAddressString();
    const data = functionToData(CreateSaleFunc, 
            { fundingGoal: ico.fundingGoal,
                etherCostOfEachToken: ico.price });
    const tx = Object.assign(initialTx, { 
        gasLimit: ico.gasLimit,
        data: data,
        from: addr });
    return (dispatch, getState) => {
        const transaction = getState().transaction;
        if (!transaction.get('busy')) {
            tx.gasPrice = transaction.get('data').get('gasPrice');
            tx.nonce = transaction.get('data').get('nonce');
        }
        return generateTx(tx, wallet.getPrivateKey()).then((result) => {
            dispatch({
                type: 'TRANSACTION/GENERATE',
                raw: result.rawTx,
                signed: result.signedTx,
            });
            return result;
        });
    }
}


export function createToken(token) {
    return (dispatch) => {
        dispatch({
            type: 'TOKEN/CREATE', 
            token,
        });
    }
}


export function createIco(ico) {
    return (dispatch) => {
        dispatch({
            type: 'TOKEN/ICO', 
            ico,
        });
    }
}
