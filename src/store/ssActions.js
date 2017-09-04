import { ShapeShift } from '../lib/shapeshift';
import { rpc } from '../lib/rpc';

const API_KEY = "3f9428e9a11ca687086ba998ccba095e64332c1d3915592c152fefc6a76de025abe2454330ae48ff57c20a416e0c5ab25623905f9c2600b07cc68e23d189b40d";
const ss = new ShapeShift.ShapeShiftApi(API_KEY);

const RELAY_ACCOUNT = "0xE4cf8aE5E9Cdc78d0d339877f05CD190Cc6f4d54";

const COIN_OUT = 'ETC';

export function loadSSCoins() {
    return (dispatch) => 
        ss.GetCoins((result) => {
            dispatch({
                type: 'SHAPESHIFT/COINS',
                coins: result,
            })
        })
}

export function getMarketData(coinIn) {
    return (dispatch) =>
        new Promise((resolve, reject) => {
            ss.GetMarketInfo(coinIn, COIN_OUT, (result) => {
                dispatch({
                    type: 'SHAPESHIFT/EXCHANGE_RATE',
                    rate: result,
                })
                resolve(result);
            })
        });
}

// Create shapeshift transaction
export function shiftIt(wallet, returnAddress, pair, amount = 1) {
    const data = {
        withdrawal: RELAY_ACCOUNT,
        apiKey: API_KEY,
        returnAddress,
        pair,
        amount,
    }
    return (dispatch) =>
        new Promise((resolve, reject) => {
            ss.FixedAmountTx(data, (result) => {
                if (result.error)
                    reject(result);
                // dispatch to tokenmint server
                const deposit = result.success;
                deposit.depositType = deposit.pair.substring(0,3);
                deposit.address = wallet.getAddressString();
                rpc.postDeposit(deposit).then((result) => {
                    console.log(result);
                    dispatch({
                        type: 'SHAPESHIFT/ADD_DEPOSIT',
                        deposit,
                    })
                });
                // TODO: resolve AFTER posting deposit
                resolve(result.success);
            })
        });
}
