import Immutable from 'immutable';

const initial = Immutable.fromJS({
    token:null,
    ico: null,
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
    etherPrice: null,
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

function onIcoCreate(state, action) {
    if (action.type === 'TOKEN/ICO') {
        const t = action.ico;
        return state.set('ico', initIco.merge({
                beneficiary: t.owner,
                fundingGoal: t.fundingGoal,
                etherPrice: t.etherPrice,
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

export default function tokenReducers(state, action) {
    state = state || initial;
    state = onTokenCreate(state, action);
    state = onTokenLoad(state, action);
    return state;
}
