import Immutable from 'immutable';

const initial = Immutable.fromJS({
    wallet: null,
    password: null,
    rates: [],
    tokens: {},
});

function onExchangeRates(state, action) {
    if (action.type === 'WALLET/RATES') {
        const rates = Object.keys(action.rates)
            .map((r) => {
                return {currency: r, rate: action.rates[r]}
            });
        return state
            .set('rates', rates)
    }
    return state;
}

function onOpen(state, action) {
    if (action.type === 'WALLET/OPEN') {
        return state
            .set('wallet', action.wallet)
            .set('password', action.password);
    }
    return state;
}

function onTokenBalance(state, action) {
    if (action.type === 'WALLET/TOKEN_BALANCE') {
        return state.update('tokens', (tokens) => 
            tokens.set(action.symbol, action.balance)
        );
    }
    return state;
}

export default function walletReducers(state, action) {
    state = state || initial;
    state = onOpen(state, action);
    state = onExchangeRates(state, action);
    state = onTokenBalance(state, action);
    return state;
}
