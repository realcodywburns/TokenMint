import Immutable from 'immutable';

const initial = Immutable.fromJS({
    coins: [],
    rate: null,
    deposits: [],
});

function onLoadCoins(state, action) {
    if (action.type === 'SHAPESHIFT/COINS') {
        return state.set('coins', Immutable.fromJS(action.coins));
    }
    return state;
}

function onExchangeRate(state, action) {
    if (action.type === 'SHAPESHIFT/EXCHANGE_RATE') {
        return state.set('rate', Immutable.fromJS(action.rate));
    }
    return state;
}

function onAddDeposit(state, action) {
    if (action.type === 'SHAPESHIFT/ADD_DEPOSIT') {
        return state.update('deposits', (deposits) => 
            deposits.push(Immutable.fromJS(state.deposit))
            );
    }
    return state;
}

export default function ssReducers(state, action) {
    state = state || initial;
    state = onLoadCoins(state, action);
    state = onExchangeRate(state, action);
    state = onAddDeposit(state, action);
    return state;
}
