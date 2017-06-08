import { Wallet } from '../lib/wallet';
import { getTransactionData } from './transactionActions';

export function openWallet(key) {
    return (dispatch) => {
        const wallet = new Wallet(key);
        dispatch({
            type: 'WALLET/OPEN',
            wallet: wallet,
        });
        dispatch(getTransactionData(wallet.getAddressString()));        
    };
}
