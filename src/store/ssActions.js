import { ShapeShift } from '../lib/shapeshift';

const SS_KEY = "3f9428e9a11ca687086ba998ccba095e64332c1d3915592c152fefc6a76de025abe2454330ae48ff57c20a416e0c5ab25623905f9c2600b07cc68e23d189b40d";
const ss = new ShapeShift.ShapeShiftApi(SS_KEY);

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

export function shiftIt(withdrawal, pair, amount) {
    const data = {
        withdrawal,
        pair,
        amount,
    }
    return (dispatch) =>
        new Promise((resolve, reject) => {
            ss.FixedAmountTx(data, (result) => {
                dispatch({
                    type: 'SHAPESHIFT/SHIFT_IT',
                    shift: result,
                })
                resolve(result);
            })
        });
}
