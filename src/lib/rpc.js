const MarketApi = "https://coinmarketcap-nexuist.rhcloud.com/api/";
const ServerApi = "https://mewapi.epool.io";

const headers = {
    'Content-Type': 'application/json',
};

export class rpc {
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
    call(name, params, headers) {
        return new Promise((resolve, reject) => {
            this.jsonPost(name, params, headers).then((json) => {
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

    getTransactionData(addr, callback) {
        const reqObj = getTransactionObj(addr);

        batchPost(reqObj).then(function(resp) {
            console.log(resp)
            if (resp.data) {
                // check for any errors in batch
                for (const d in resp.data) {
                    if (d.error) {
                        reject(d.error);
                    }
                }
                resolve(resp.data);
            } else {
                reject(new Error(`Unknown JSON RPC response: ${json}`));
            }
        }).catch((error) => reject(error));
    }

    jsonPost(name, params, headers) {
        const data = {
            jsonrpc: '2.0',
            method: name,
            params,
            id: this.dataId++,
        };
        return fetch(ServerApi, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        }).then((response) => response.json());
    }

    batchPost(data, headers) {
        return fetch(ServerApi, {
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
}


export default rpc;