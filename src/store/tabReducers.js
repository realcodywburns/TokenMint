import Immutable from 'immutable';

const initial = Immutable.fromJS({
    id: 'wallet',
    params: null,
});


function onOpen(state, action) {
    if (action.type === 'TAB/OPEN') {
        return state
            .set('id', action.id)
            .set('params', action.params);
    }
    return state;
}

export default function screenReducers(state, action) {
    state = state || initial;
    state = onOpen(state, action);
    return state;
}
