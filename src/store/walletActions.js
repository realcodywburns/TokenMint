import { Wallet } from '../lib/wallet';
import { getTransactionData } from './transactionActions';
import { readTokens } from './tokenActions';

export function openWallet(key) {
    return (dispatch) => {
        const wallet = new Wallet(key);
        dispatch({
            type: 'WALLET/OPEN',
            wallet: wallet,
        });
        const address = wallet.getAddressString()
        dispatch(getTransactionData(address)); 
        // Look up user tokens in registry
        dispatch(readTokens(address))       
    };
}
