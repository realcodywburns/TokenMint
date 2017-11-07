import { rpc } from '../lib/rpc';
import { Wallet } from '../lib/wallet';
import { getTransactionData } from './transactionActions';
import { loadOwnTokens, getBalanceOf } from './tokenActions';
import TOKENS from '../TOKENS';

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
        dispatch(loadOwnTokens(address));
        for (var tok of TOKENS) {
            dispatch(getBalanceOf(tok, address));
        }
        return wallet;     
    };
}

export function openWalletFile(file, password = null) {
    return (dispatch) => {
        let wallet;
        try { // TODO: Better error handling here
            wallet = Wallet.getWalletFromPrivKeyFile(file, password);
        } catch (e) {
            return new Error(e);
        }
        const address = wallet.getAddressString();
        dispatch({
            type: 'WALLET/OPEN',
            wallet: wallet,
            password,
            address,
        });
        dispatch(getTransactionData(address)); 
        dispatch(loadOwnTokens(address));
        return wallet;
    };
}

export function viewWallet(address) {
    return (dispatch) => {
        dispatch({
            type: 'WALLET/VIEW',
            address,
        });
        dispatch(getTransactionData(address)); 
        // Look up user tokens in registry
        dispatch(loadOwnTokens(address));
        for (var tok of TOKENS) {
            dispatch(getBalanceOf(tok, address));
        }
    };
}

export function closeWallet() {
    return (dispatch) => {
        dispatch({
            type: 'WALLET/CLOSE',
        });
    };
}

export function getExchangeRates() {
    return (dispatch) => {
        rpc.getExchangeRates().then((result) => {
            if (result[0]) {
                const rates = {
                    usd: parseFloat(result[0].price_usd),
                    btc: parseFloat(result[0].price_btc)
                };
                dispatch({
                    type: 'WALLET/RATES',
                    rates,
                });
            }
        })  
    }
}
