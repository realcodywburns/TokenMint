import Immutable from 'immutable';

const IcoMachineAddress = "0x26c243b8a4a460a9bb20f3afcf127fa7dd764cfa";

const CreateTokenFunc = Immutable.fromJS({
    name:'createToken',
    inputs:[{ name:'initialSupply', type:'uint256' },
            { name:'tokenName', type:'string' },
            { name:'decimals', type:'uint8' },
            { name:'symbol', type:'string' }]
    });

const CreateSaleFunc = Immutable.fromJS({
    name:'createSale',
    inputs:[{ name:'fundingGoal', type:'uint' },
            { name:'etherCostOfEachToken', type:'uint' }],
    outputs:[{ name:'_saleAddress', type:'address' }]
    });

const TokensFunc = Immutable.fromJS({
    name:'tokens',
    inputs:[{ name: '', type: 'address' }],
    outputs:[{name:"tokenAddress","type":"address"},
            {name:"saleAddress","type":"address"},
            {name:"initialSupply","type":"uint256"},
            {name:"tokenName","type":"string"},
            {name:"decimals","type":"uint8"},
            {name:"symbol","type":"string"}]
});

const CrowdSaleFuncs = [
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
