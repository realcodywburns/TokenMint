import { Wallet } from '../lib/wallet';

export function openWallet(key) {
    return (dispatch) => {
        console.log(key)
        const wallet = new Wallet(key);
        console.log(wallet)
        dispatch({
            type: 'WALLET/OPEN',
            wallet: wallet,
        });
    };
}
