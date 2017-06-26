import Immutable from 'immutable';

export const TokenMintAddress = "0x0023BEBee6FAE12E3b387497300FEd1316e6905e";

export const IcoMachineAddress = "0x2f846034a256f51ae51249b61f4c92bcf4b0a3d8";

export const RegContractAddress = '0x0c33c443f4e01c52e411ae3e165f99934ba43ac5';

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

export const joinTheReg =  Immutable.fromJS({
  name: 'register',
  inputs:[{name:"_tAddr", type : "address"},
          {name:"_tSale", type: "address"},
          {name:"_tName", type: "string"},
          {name:"_tSymbol", type:"string"},
          {name:"_tDecimal",type:"uint"},
          {name:"_tType",type:"string"},
          {name:"_tIcon",type:"string"}]
});

export const regCount =  Immutable.fromJS({
        name: "Count",
        inputs:[],
        outputs:[{ name: '', type: 'uint'}]
      });

export const regData =  Immutable.fromJS({
        name: "getArray",
        inputs:[{name:"_index", type:"uint"}],
        outputs:[{ name: 'tAddr', type: 'address'},
                { name: 'tSale', type: 'address'},
                { name: 'tName', type: 'string'},
                { name: 'tSymbol', type: 'string'},
                { name: 'tDecimal', type: 'uint'},
                { name: 'tType', type: 'string'},
                { name: 'tIcon', type: 'string'}]
    });
