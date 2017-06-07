import ethUtil from 'ethereumjs-util';
import ethTx from './etherTx';
import { isNumeric, validateHexString } from './validate';
import { sanitizeHex, decimalToHex } from './convert';
import { toWei } from './etherUnits';

const ChainId = 61;

export function isTxDataValid(txData) {
    if (!isNumeric(txData.value) || parseFloat(txData.value) < 0) 
        throw new Error('Not numeric value');
    else if (!isNumeric(txData.gasLimit) || parseFloat(txData.gasLimit) <= 0) 
        throw new Error('Not numeric gas limit');
    else if (!validateHexString(txData.data)) 
        throw new Error('invalid data');
};
export function signTxLedger(app, eTx, rawTx, txData, old, callback) {
    eTx.raw[6] = Buffer.from([1]); //ETH chain id
    eTx.raw[7] = eTx.raw[8] = 0;
    var toHash = old ? eTx.raw.slice(0, 6) : eTx.raw;
    var txToSign = ethUtil.rlp.encode(toHash);
    var localCallback = function(result, error) {
        if (typeof error !== "undefined") {
            if (callback !== undefined) callback({
                isError: true,
                error: error
            });
            return;
        }
        rawTx.v = "0x" + result['v'];
        rawTx.r = "0x" + result['r'];
        rawTx.s = "0x" + result['s'];
        eTx = new ethUtil.Tx(rawTx);
        rawTx.rawTx = JSON.stringify(rawTx);
        rawTx.signedTx = '0x' + eTx.serialize().toString('hex');
        rawTx.isError = false;
        if (callback !== undefined) callback(rawTx);
    };
    app.signTransaction(txData.path, txToSign.toString('hex'), localCallback);
};
export function generateTx(data, key) {
    return new Promise((resolve, reject) => {
        try {
            var rawTx = {
                nonce: sanitizeHex(data.nonce),
                gasPrice: sanitizeHex(data.gasPrice),
                gasLimit: sanitizeHex(data.gasLimit),
                to: sanitizeHex(data.to),
                value: sanitizeHex(decimalToHex(toWei(data.value, data.unit))),
                data: sanitizeHex(data.data),
                chainId: ChainId
            };
            var eTx = new ethTx(rawTx);
            eTx.sign(new Buffer(key, 'hex'));
            rawTx.rawTx = JSON.stringify(rawTx);
            rawTx.signedTx = '0x' + eTx.serialize().toString('hex');
            rawTx.isError = false;
            resolve(rawTx);
        } catch (e) {
            reject(e)
        }
    });
};
