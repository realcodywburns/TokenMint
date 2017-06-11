import { rpc } from '../lib/rpc';
import { Wallet } from '../lib/wallet';
import { getTransactionData } from './transactionActions';
import { readTokens } from './tokenActions';

export function openWallet(key, password = null) {
    return (dispatch) => {
        let wallet;
        try { // TODO: Better error handling here
            if (password)
                wallet = Wallet.fromMyEtherWalletKey(key, password);
            else 
                wallet = new Wallet(key);
        } catch (e) {
            return new Error(e);
        }
        dispatch({
            type: 'WALLET/OPEN',
            wallet: wallet,
            password,
        });
        const address = wallet.getAddressString()
        dispatch(getTransactionData(address)); 
        // Look up user tokens in registry
        dispatch(readTokens(address));
        return wallet;     
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

export function getExchangeRates() {
    return (dispatch) => {
        rpc.getExchangeRates().then((result) => {
            const rates = {
                usd: result.usd.toFixed(6),
                eur: result.eur.toFixed(6),
                btc: result.btc.toFixed(6)
            };
            dispatch({
                type: 'WALLET/RATES',
                rates,
            });
        })  
    }
}