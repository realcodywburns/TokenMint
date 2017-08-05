const MarketApi = "https://coinmarketcap-nexuist.rhcloud.com/api/";
const NodeApi = "https://mewapi.epool.io";
const ServerApi = "http://localhost:8000/add";
const Currency = "etc";

const headers = {
    'Content-Type': 'application/json',
};

export class RpcApi {
    constructor() {
        this.dataId = 1;
    }

    /**
    * This call analyses JSON RPC response.
    * It returns promise which resolves whether 'result' field found
    * or reject in case 'error' field found.
    *
    * @returns {Promise}
    */
    call(name, params) {
        return new Promise((resolve, reject) => {
            this.jsonPost(name, params, headers).then((json) => {
                console.log(json)
                if (json.result) {
                    resolve(json.result);
                } else if (json.error) {
                    reject(json.error);
                } else {
                    reject(new Error(`Unknown JSON RPC response: ${json}`));
                }
            }).catch((error) => reject(error));
        });
    }

    getTransactionData(addr) {
        const reqObj = this.getTransactionObj(addr);
        return new Promise((resolve, reject) => {

            this.batchPost(reqObj).then(function(resp) {
                console.log(resp)
                if (resp) {
                    // check for any errors in batch
                    for (const d in resp) {
                        if (d.error) {
                            reject(d.error);
                        }
                    }
                    resolve(resp);
                } else {
                    reject(new Error(`Unknown JSON RPC response: ${resp}`));
                }
            }).catch((error) => reject(error));
        });
    }

    jsonPost(name, params, headers) {
        const data = {
            jsonrpc: '2.0',
            method: name,
            params,
            id: this.dataId++,
        };
        return fetch(NodeApi, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        }).then((response) => response.json());
    }

    batchPost(data) {
        return fetch(NodeApi, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        }).then((response) => response.json());
    }

    getTransactionObj(addr) {
        return [
            { id: this.dataId++,
              jsonrpc: '2.0', 
              method: "eth_getBalance", 
              params: [addr, 'latest'] },
            { id: this.dataId++,
              jsonrpc: '2.0', 
              method: "eth_gasPrice", 
              params: [] },
            { id: this.dataId++,
              jsonrpc: '2.0', 
              method: "eth_getTransactionCount", 
              'params': [addr, 'latest'] }
        ];
    }

    getExchangeRates() {
        return fetch(MarketApi + Currency, {
            method: 'GET',
            headers: headers,
        }).then((response) => response.json());
    }

    postDeposit(data) {
        data.id = this.dataId++;
        return fetch(ServerApi, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        }).then((response) => response.json());
    }
}

export const rpc = new RpcApi();
export default rpc;