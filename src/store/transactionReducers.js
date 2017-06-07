import Immutable from 'immutable';

const initial = Immutable.fromJS({
    raw: null,
    signed: null,
    data: null,
    hashes: [],
    busy: false,
});

const txData = Immutable.fromJS({
    address: null,
    balance: null,
    gasPrice: null,
    nonce: null,
});

function onLoading(state, action) {
    if (action.type === 'TRANSACTION/BUSY') {
        return state.set('busy', true);
    }
    return state;
}


function onTransactionData(state, action) {
    if (action.type === 'TRANSACTION/DATA') {
        const data = txData.set('address', action.address)
            .set('balance', action.balance)
            .set('gasPrice', action.gasPrice)
            .set('nonce', action.nonce)
        return state.set('data', data)
            .set('busy', false);
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

/*
    Reset Transaction state, save tx hash
*/
function onTransactionSend(state, action) {
    if (action.type === 'TRANSACTION/SEND') {
        return state
            .set('raw', null)
            .set('signed', null)
            .set('data', null)
            .update('hashes', (h) => h.push(action.tx));
    }
    return state;
}

export default function transactionReducers(state, action) {
    state = state || initial;
    state = onLoading(state, action);
    state = onTransactionData(state, action);
    state = onTransactionGenerate(state, action);
    return state;
}
