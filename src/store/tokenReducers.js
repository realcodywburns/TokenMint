import Immutable from 'immutable';

const initial = Immutable.fromJS({
    token:null
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
    saleTx: null,
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

function onTokenLoad(state, action) {
    if (action.type === 'TOKEN/LOAD') {
        const t = action.token;
        if (!state.get('token') || 
            (t.owner !== state.get('token').get('owner'))) {
            console.log("new tokens")
            return state.set('token', initToken.merge({
                    owner: t.owner,
                    initialSupply: t.initialSupply,
                    name: t.tokenName,
                    saleAddress: t.saleAddress,
                    tokenAddress: t.tokenAddress,
                    decimals: t.decimals,
                    symbol: t.symbol,
                    tokenTx: t.tokenTx,
                })
            );
        }
    }
    return state;    
}

export default function tokenReducers(state, action) {
    state = state || initial;
    state = onTokenCreate(state, action);
    state = onTokenLoad(state, action);
    return state;
}
