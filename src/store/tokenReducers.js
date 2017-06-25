import Immutable from 'immutable';

const initial = Immutable.fromJS({
    token:null,
    ico: null,
    custom: [],
});

const initToken = Immutable.fromJS({
    owner: null,
    tokenAddress: null,
    saleAddress: null,
    initialSupply: null,
    name: null,
    decimals: 8,
    symbol: null,
    tokenTx: null,
});

const initIco = Immutable.fromJS({
    beneficiary: null,
    fundingGoal: null,
    tokenPrice: null,
    saleTx: null,
    amountRaised: null,
});

const customToken = Immutable.fromJS({
    name: null,
    decimals: 8,
    symbol: null,
});

function onTokenCreate(state, action) {
    if (action.type === 'TOKEN/CREATE') {
        const t = action.token;
        return state.set('token', initToken.merge({
                owner: t.owner,
                initialSupply: t.initialSupply,
                name: t.name,
                decimals: t.decimals,
                symbol: t.symbol,
                tokenTx: t.tokenTx,
            })
        );
    }
    return state;
}

function onIcoCreate(state, action) {
    if (action.type === 'TOKEN/ICO') {
        const t = action.ico;
        return state.set('ico', initIco.merge({
                beneficiary: t.owner,
                fundingGoal: t.fundingGoal,
                price: t.price,
                saleTx: t.saleTx,
            })
        );
    }
    return state;
}

function onTokenLoad(state, action) {
    if (action.type === 'TOKEN/LOAD') {
        const t = action.token;
        if (!state.get('token') || 
            (t.owner !== state.get('token').get('owner'))) {
            return state.set('token', initToken.merge({
                    owner: t.owner,
                    initialSupply: t.initialSupply.toString(10),
                    name: t.tokenName,
                    saleAddress: t.saleAddress,
                    tokenAddress: t.tokenAddress,
                    decimals: t.decimals.toString(10),
                    symbol: t.symbol,
                    tokenTx: t.tokenTx,
                })
            );
        }
    }
    return state;    
}

function onCrowdsaleLoad(state, action) {
    if (action.type === 'TOKEN/ICO_INFO') {
        if (!state.get('ico'))
            return state.set('ico', initIco.set(action.name, action.value));
        else
            return state.update('ico', (ico) => 
               ico.set(action.name, action.value)
        );
    }
    return state;    
}

function updateCustomToken(state, address, f) {
    return state.update('custom', (custom) => {
        const pos = custom.findKey((tok) => tok.get('address') === address);
        if (pos >= 0) {
            return custom.update(pos, f);
        } else {
            return custom.push(f(customToken.set('address', address)));
        }
    });
}


function onCustomToken(state, action) {
    if (action.type === 'TOKEN/CUSTOM_TOKEN') {
        return updateCustomToken(state, action.address, (tok) =>
            tok.set(action.name, action.value)
        );
    }
    return state;    
}

export default function tokenReducers(state, action) {
    state = state || initial;
    state = onTokenCreate(state, action);
    state = onIcoCreate(state, action);
    state = onTokenLoad(state, action);
    state = onCrowdsaleLoad(state, action);
    state = onCustomToken(state, action);
    return state;
}
