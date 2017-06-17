import Immutable from 'immutable';

export const TokenMintAddress = "0x0023BEBee6FAE12E3b387497300FEd1316e6905e";

export const IcoMachineAddress = "0x26c243b8a4a460a9bb20f3afcf127fa7dd764cfa";

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
            { name:'etherCostOfEachToken', type:'uint' }],
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
        name: "tokenPrice",
        inputs:[],
        outputs:[{ name: '', type: 'uint'}]
    }),
    Immutable.fromJS({
        name: "tokenReward",
        inputs:[],
        outputs:[{ name: '', type: 'address'}]
    })
]
