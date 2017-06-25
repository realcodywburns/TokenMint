import Immutable from 'immutable';

export const TokenMintAddress = "0x0023BEBee6FAE12E3b387497300FEd1316e6905e";

export const IcoMachineAddress = "0x2f846034a256f51ae51249b61f4c92bcf4b0a3d8";

export const CreateTokenFunc = Immutable.fromJS({
    name:'createToken',
    inputs:[{ name:'initialSupply', type:'uint256' },
            { name:'tokenName', type:'string' },
            { name:'decimals', type:'uint8' },
            { name:'symbol', type:'string' }]
    });

export const CreateSaleFunc = Immutable.fromJS({
    name:'createSale',
    inputs:[{ name:'fundingGoal', type:'uint' },
            { name:'costOfEachToken', type:'uint' }],
    outputs:[{ name:'_saleAddress', type:'address' }]
    });

export const TokensFunc = Immutable.fromJS({
    name:'tokens',
    inputs:[{ name: '', type: 'address' }],
    outputs:[{name:"tokenAddress","type":"address"},
            {name:"saleAddress","type":"address"},
            {name:"initialSupply","type":"uint256"},
            {name:"tokenName","type":"string"},
            {name:"decimals","type":"uint8"},
            {name:"symbol","type":"string"}]
});

export const BalanceOfFunc = Immutable.fromJS({
    name:'balanceOf',
    inputs:[{name:'_owner',type:'address'}],
    outputs:[{name:'balance',type:'uint256'}]
});

export const TransferTokensFunc = Immutable.fromJS({
    name:'transfer',
    inputs:[{ name:'_to', type:'address' },
            { name:'_value', type:'uint256' }]
    });

export const CrowdSaleFuncs = [
    Immutable.fromJS({
        name: "amountRaised",
        inputs:[],
        outputs:[{ name: '', type: 'uint'}]
    }),
    Immutable.fromJS({
        name: "beneficiary",
        inputs:[],
        outputs:[{ name: '', type: 'address'}]
    }),
    Immutable.fromJS({
        name: "fundingGoal",
        inputs:[],
        outputs:[{ name: '', type: 'uint'}]
    }),
    Immutable.fromJS({
        name: "price",
        inputs:[],
        outputs:[{ name: '', type: 'uint'}]
    }),
    Immutable.fromJS({
        name: "tokenReward",
        inputs:[],
        outputs:[{ name: '', type: 'address'}]
    })
]

export const ERC20Funcs = [
    Immutable.fromJS({
        name: "name",
        inputs:[],
        outputs:[{ name: '', type: 'string'}]
    }),
    Immutable.fromJS({
        name: "symbol",
        inputs:[],
        outputs:[{ name: '', type: 'string'}]
    }),
    Immutable.fromJS({
        name: "decimals",
        inputs:[],
        outputs:[{ name: '', type: 'uint8'}]
    }),
    Immutable.fromJS({
        name: "totalSupply",
        inputs:[],
        outputs:[{ name: '', type: 'uint256'}]
    }),
]
