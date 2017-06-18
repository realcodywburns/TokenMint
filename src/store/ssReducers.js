import Immutable from 'immutable';

const initial = Immutable.fromJS({
    coins: [],
    rate: null,
    depositStatus: null,
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

export default function ssReducers(state, action) {
    state = state || initial;
    state = onLoadCoins(state, action);
    return state;
}
