import { rpc } from '../lib/rpc';
import BigNumber from 'bignumber.js';

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

export function sendTransaction(tx) {
    return (dispatch, getState) => 
        rpc.call("eth_sendRawTransaction", [tx]).then((result) => {
            dispatch({
                type: 'TRANSACTION/SEND',
                tx: result
            });
            return result;
        })
};