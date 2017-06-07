import { rpc } from '../lib/rpc';
import BigNumber from 'bignumber.js';

export function getTransactionData(addr) {
    return (dispatch) => {
        dispatch({
            type: 'TRANSACTION/BUSY',
        });
        rpc.getTransactionData(addr).then((result) => {
            const balance = new BigNumber(result[0].result).toString();
            const gasPrice = result[1].result;
            const nonce = result[2].result;
            dispatch({
                type: 'TRANSACTION/DATA',
                balance,
                gasPrice,
                nonce,
            });
        });    
    }
}