import Immutable from 'immutable';

const initial = Immutable.fromJS({
    wallet: null,
    password: null,
});


function onOpen(state, action) {
    if (action.type === 'WALLET/OPEN') {
        return state
            .set('wallet', action.wallet)
            .set('password', action.password);
    }
    return state;
}

export default function walletReducers(state, action) {
    state = state || initial;
    state = onOpen(state, action);
    return state;
}
