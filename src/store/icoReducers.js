import Immutable from 'immutable';

const initial = Immutable.fromJS({
    id: null,
    ico: null,
    balance: 0,
});

const initIco = Immutable.fromJS({
    beneficiary: null,
    fundingGoal: null,
    tokenPrice: null,
    saleTx: null,
    amountRaised: null,
    tokenAddress: null,
    saleAddress: null,
    initialSupply: null,
    name: null,
    decimals: 8,
    symbol: null,
});

function onIcoLoad(state, action) {
    if (action.type === 'ICO/ICO_INFO') {
        if (!state.get('ico'))
            return state.set('ico', initIco.set(action.name, action.value.toString()));
        else
            return state.update('ico', (ico) => 
               ico.set(action.name, action.value.toString())
        );
    }
    return state;    
}

function onIcoId(state, action) {
    if (action.type === 'ICO/ICO_ID') {       
        return state.set('id', action.id);
    }
    return state;        
}

function onBalanceOf(state, action) {
    if (action.type === 'ICO/BALANCE_OF') {       
        return state.set('balance', action.value);
    }
    return state;         
}

export default function tokenReducers(state, action) {
    state = state || initial;
    state = onIcoLoad(state, action);
    state = onIcoId(state, action);
    state = onBalanceOf(state, action);
    return state;
}
