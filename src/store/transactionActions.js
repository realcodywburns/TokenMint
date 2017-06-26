import { rpc } from '../lib/rpc';
import BigNumber from 'bignumber.js';
import { generateTx } from '../lib/transaction';

export function getTransactionData(address) {
    return (dispatch) => {
        dispatch({
            type: 'TRANSACTION/BUSY',
        });
        rpc.getTransactionData(address).then((result) => {
            const balance = new BigNumber(result[0].result).toString();
            const gasPrice = result[1].result;
            const nonce = result[2].result;
            dispatch({
                type: 'TRANSACTION/DATA',
                balance,
                gasPrice,
                nonce,
                address,
            });
        });    
    }
}

export function generateSendTransaction(data, wallet) {
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
};

export function sendTransaction(tx) {
    return (dispatch, getState) => 
        rpc.call("eth_sendRawTransaction", [tx]).then((result) => {
            dispatch({
                type: 'TRANSACTION/SEND',
                tx: result
            });
            return result;
        }).catch((error) => {
            console.error(error);
            return null;
        });
};