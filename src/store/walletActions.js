import { Wallet } from '../lib/wallet';
import { getTransactionData } from './transactionActions';
import { readTokens } from './tokenActions';

export function openWallet(key, password = null) {
    return (dispatch) => {
        let wallet;
        if (password)
            wallet = Wallet.fromMyEtherWalletKey(key, password);
        else 
            wallet = new Wallet(key);
        dispatch({
            type: 'WALLET/OPEN',
            wallet: wallet,
            password,
        });
        const address = wallet.getAddressString()
        dispatch(getTransactionData(address)); 
        // Look up user tokens in registry
        dispatch(readTokens(address))       
    };
}

export function openWalletFile(file, password = null) {
    return (dispatch) => {
        const wallet = Wallet.getWalletFromPrivKeyFile(file, password);
        dispatch({
            type: 'WALLET/OPEN',
            wallet: wallet,
            password,
        });
        const address = wallet.getAddressString()
        dispatch(getTransactionData(address)); 
        dispatch(readTokens(address))       
    };
}
