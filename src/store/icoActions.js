import { rpc } from '../lib/rpc';
import { generateTx } from '../lib/transaction';
import { functionToData, dataToParams, paramsToToken } from '../lib/convert';
import { IcoMachineAddress, CreateTokenFunc, CreateSaleFunc, TokensFunc, CrowdSaleFuncs } from '../lib/contract';

export function fetchToken(address) {
    return (dispatch) => {
        const data = functionToData(TokensFunc, { '': address });
        return rpc.call("eth_call", [{ 
            to: IcoMachineAddress,
            data: data,
        }]).then((result) => {
            const params = dataToParams(TokensFunc, result);
            const outputs = paramsToToken(params);
            for (var o of Object.keys(outputs)) {
                dispatch({
                    type: 'ICO/ICO_INFO',
                    name: o,
                    value: outputs[o],
                })
            }
        })
    }
}
    
/** 
    Right now, ICO ID is address
    In the future it may be a db key
**/
export function fetchIco(address) {
    return (dispatch) => {
        let data;
        for (const c of CrowdSaleFuncs) {
            data = functionToData(c, {});
            rpc.call("eth_call", [{
                to: address,
                data: data,
            }]).then((result) => {
                const params = dataToParams(c, result);
                const outputs = paramsToToken(params);
                dispatch({
                    type: 'ICO/ICO_INFO',
                    name: c.get('name'),
                    value: outputs[""],
                });
                if (c.get('name') === 'beneficiary')
                   dispatch(fetchToken(outputs[""]));
               dispatch({
                    type: 'ICO/ICO_ID',
                    id: address,
                });
            })
        }
    }
}