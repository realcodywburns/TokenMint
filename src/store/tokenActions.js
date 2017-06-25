import { rpc } from '../lib/rpc';
import { generateTx } from '../lib/transaction';
import { functionToData, dataToParams, paramsToToken } from '../lib/convert';
import { IcoMachineAddress, CreateTokenFunc, CreateSaleFunc, TokensFunc } from '../lib/contract';
import { ERC20Funcs, TransferTokensFunc, CrowdSaleFuncs } from '../lib/contract';

const initialTx = {
    to: IcoMachineAddress,
    value: 0,
    gasLimit: null,
    gasPrice: null,
    nonce: null,
    data: '0x',
};

export function readTokens(address) {
    return (dispatch) => {
        const data = functionToData(TokensFunc, { '': address });
        return rpc.call("eth_call", [{ 
            to: IcoMachineAddress,
            data: data,
        }]).then((result) => {
            const params = dataToParams(TokensFunc, result);
            const outputs = paramsToToken(params);
            console.log(outputs)
            if(outputs.tokenAddress==="0x00")
                return;
            outputs.owner = address;
            dispatch({
                type: 'TOKEN/LOAD',
                token: outputs,
            })
        })
    }
}
    

export function loadCustomToken(address) {
    return (dispatch) => {
        let data;
        for (const c of ERC20Funcs) {
            data = functionToData(c, {});
            rpc.call("eth_call", [{
                to: address,
                data: data,
            }]).then((result) => {
                const params = dataToParams(c, result);
                const outputs = paramsToToken(params);
                dispatch({
                    type: 'TOKEN/CUSTOM_TOKEN',
                    name: c.get('name'),
                    value: outputs[""],
                    address,
                });
            })
        }
    }
}

export function loadCrowdSale(address) {
    return (dispatch) => {
        let data;
        for (const c of CrowdSaleFuncs) {
            data = functionToData(c, {});
            rpc.call("eth_call", [{
                to: address,
                data: data,
            }]).then((result) => {
                const params = dataToParams(c, result);
                const outputs = paramsToToken(params);
                dispatch({
                    type: 'TOKEN/ICO_INFO',
                    name: c.get('name'),
                    value: outputs[""],
                });
                if (c.get('name') === 'beneficiary')
                   dispatch(readTokens(outputs[""]));
            })
        }
    }
}

export function estimateTokenGas(token, wallet) {
    return (dispatch) => {
        const data = functionToData(CreateTokenFunc, 
            { initialSupply: token.totalSupply || 0, 
            tokenName: token.token || "TokenMint", 
            decimals: token.decimals || 8,
            symbol: token.symbol || "TOKN" });
        return rpc.call("eth_estimateGas", [{
            from: wallet.getAddressString(),
            to: IcoMachineAddress,
            data: data,
        }]).then((result) => {
            console.log(result);
            return result;
        }).catch((error) => {
            console.error(error);
            return null;
        });
    }
}

export function estimateIcoGas(ico, wallet) {
    const addr =  wallet.getAddressString();
    return (dispatch) => {
        const data = functionToData(CreateSaleFunc, 
            { fundingGoal: ico.fundingGoal,
                costOfEachToken: ico.price});
        return rpc.call("eth_estimateGas", [{
            from: addr,
            to: IcoMachineAddress,
            data: data,
        }]).then((result) => {
            console.log(result);
            return result;
        }).catch((error) => {
            console.error(error);
            return null;
        });
    }
}

export function generateTokenTransaction(token, wallet) {
    const addr = wallet.getAddressString();
    const data = functionToData(CreateTokenFunc, 
            { initialSupply: token.totalSupply || 0, 
            tokenName: token.token || "TokenMint", 
            decimals: token.decimals || 8,
            symbol: token.symbol || "TOKN"});
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
                costOfEachToken: ico.price });
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

// Buy tokens is the equivalent of sending money to contract address
export function generateBuyIco(data, wallet) {
    const addr = wallet.getAddressString();
    const tx = {
        to: data.to, 
        gasLimit: data.gasLimit,
        data: "",
        value: data.value,
        from: addr };
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

export function generateSendTokenTransaction(tokenAddress, send, wallet) {
    const addr = wallet.getAddressString();
    const data = functionToData(TransferTokensFunc, 
            { _to: send.to, 
            _value: send.value });
    const tx = Object.assign(initialTx, { 
        gasLimit: send.gasLimit,
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
