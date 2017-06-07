import { rpc } from '../lib/rpc';
import BigNumber from 'bignumber.js';
import { generateTx } from '../lib/transaction';

const IcoMachineAddress = "0x26c243b8a4a460a9bb20f3afcf127fa7dd764cfa";

const InitTx = {
                to: IcoMachineAddress,
                value: 0,
                unit: "ether",
                gasLimit: null,
                gasPrice: null,
                nonce: null,
                data: '0x',
            };

export function generateTokenTransaction(token, wallet) {
    const addr = wallet.getAddressString();
    const tx = InitTx;
    tx.from = addr;
    return (dispatch, getState) => rpc.getTransactionData(addr).then((result) => {
            tx.balance = new BigNumber(result[0].result).toString();
            tx.gasPrice = result[1].result;
            tx.nonce = result[2].result;
            const data = {
                from: tx.from,
                data: tx.data
            }
            rpc.call("eth_estimateGas", [data]).then((result) => {
                tx.gasLimit = result;    
                generateTx(tx, wallet.getPrivateKey()).then((rawTx) => {
                    dispatch({
                        type: 'TRANSACTION/GENERATE',
                        tx: rawTx
                    });
                    console.log(rawTx)
                    return rawTx;
                });
            })
        });
}

export function sendTransaction(tx) {
    return (dispatch, getState) => 
        rpc.call("eth_sendRawTransaction", [tx]).then((result) => {
            dispatch({
                type: 'TRANSACTION/SEND',
                tx: result
            });
        })
};
