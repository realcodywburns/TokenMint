import Immutable from 'immutable';

const initial = Immutable.fromJS({
    raw: null,
    signed: null,
    data: null,
});

const txData = Immutable.fromJS({
    address: null,
    balance: null,
    gasPrice: null,
    nonce: null,
});

function onTransactionData(state, action) {
    if (action.type === 'TRANSACTION/DATA') {
        const data = txData.set('address', action.address)
            .set('balance', action.balance)
            .set('gasPrice', action.gasPrice)
            .set('nonce', action.nonce)
        return state.set('data', data)
    }
    return state;
}

function onTransactionGenerate(state, action) {
    if (action.type === 'TRANSACTION/GENERATE') {
        return state
            .set('raw', action.raw)
            .set('signed', action.signed);
    }
    return state;
}

export default function transactionReducers(state, action) {
    state = state || initial;
    state = onTransactionData(state, action);
    state = onTransactionGenerate(state, action);
    return state;
}
