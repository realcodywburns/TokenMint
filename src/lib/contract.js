import Immutable from 'immutable';

export const TokenMintAddress = "0x0023BEBee6FAE12E3b387497300FEd1316e6905e";

export const IcoMachineAddress = "0xff3da40077e541fdb56d85ac24c03ccd3a520d79";

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
