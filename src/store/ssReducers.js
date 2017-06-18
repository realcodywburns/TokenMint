import Immutable from 'immutable';

const initial = Immutable.fromJS({
    coins: [],
    depositStatus: null,
});

function onLoadCoins(state, action) {
    if (action.type === 'SHAPESHIFT/COINS') {
        return state.set('coins', Immutable.fromJS(action.coins));
    }
    return state;
}

export default function ssReducers(state, action) {
    state = state || initial;
    state = onLoadCoins(state, action);
    return state;
}
