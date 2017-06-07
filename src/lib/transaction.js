import ethUtil from 'ethereumjs-util';
import { rpc } from './rpc';
import { isNumeric, validateHexString, validateEtherAddress } from './validate';
import { sanitizeHex, decimalToHex } from './convert';
import { toWei } from './etherUnits';

const ChainId = 61;

export function isTxDataValid(txData) {
    console.log(txData)
    if (txData.to != "0xCONTRACT" && !validateEtherAddress(txData.to)) 
        throw new Error('Error');
    else if (!isNumeric(txData.value) || parseFloat(txData.value) < 0) 
        throw new Error('Error');
    else if (!isNumeric(txData.gasLimit) || parseFloat(txData.gasLimit) <= 0) 
        throw new Error('Error');
    else if (!validateHexString(txData.data)) 
        throw new Error('Error');
    if (txData.to === "0xCONTRACT") txData.to = '';
};
export function signTxLedger(app, eTx, rawTx, txData, old, callback) {
    eTx.raw[6] = Buffer.from([1]); //ETH chain id
    eTx.raw[7] = eTx.raw[8] = 0;
    var toHash = old ? eTx.raw.slice(0, 6) : eTx.raw;
    var txToSign = ethUtil.rlp.encode(toHash);
    var localCallback = function(result, error) {
        if (typeof error != "undefined") {
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
export function generateTx(data, key, callback) {
    return new Promise((resolve, reject) => {
        try {
            isTxDataValid(data);
            var rawTx = {
                nonce: sanitizeHex(data.nonce),
                gasPrice: sanitizeHex(data.gasprice),
                gasLimit: sanitizeHex(decimalToHex(data.gasLimit)),
                to: sanitizeHex(data.to),
                value: sanitizeHex(decimalToHex(toWei(data.value, data.unit))),
                data: sanitizeHex(data.data),
                chainId: ChainId
            };
            var eTx = new ethUtil.Tx(rawTx);
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
/*
export function sendTx(signedTx, callback) {
    ajaxReq.sendRawTx(signedTx, function (data) {
        var resp = {};
        if (data.error) {
            resp = {
                isError: true,
                error: data.msg
            };
        } else {
            resp = {
                isError: false,
                data: data.data
            };
        }
        if (callback !== undefined) callback(resp);
    });
};
export function transferAllBalance(fromAdd, gasLimit, callback) {
    try {
        ajaxReq.getTransactionData(fromAdd, function (data) {
            if (data.error) throw data.msg;
            data = data.data;
            var gasPrice = new BigNumber(ethFuncs.sanitizeHex(ethFuncs.addTinyMoreToGas(data.gasprice))).times(gasLimit);
            var maxVal = new BigNumber(data.balance).minus(gasPrice);
            maxVal = etherUnits.toEther(maxVal, 'wei') < 0 ? 0 : etherUnits.toEther(maxVal, 'wei');
            if (callback !== undefined) callback({
                isError: false,
                unit: "ether",
                value: maxVal
            });
        });
    } catch (e) {
        if (callback !== undefined) callback({
            isError: true,
            error: e
        });
    }
};
export function notifier = {
    show: false,
    close: function close() {
        this.show = false;if (!this.scope.$$phase) this.scope.$apply();
    },
    open: function open() {
        this.show = true;
    },
    class: '',
    message: '',
    timer: null,
    sce: null,
    scope: null,
    warning: function warning(msg) {
        this.setClassAndOpen("alert-warning", msg);
    },
    info: function info(msg) {
        this.setClassAndOpen("", msg);
        this.setTimer();
    },
    danger: function danger(msg) {
        this.setClassAndOpen("alert-danger", msg);
    },
    success: function success(msg) {
        this.setClassAndOpen("alert-success", msg);
    },
    setClassAndOpen: function setClassAndOpen(_class, msg) {
        this.class = _class;
        this.message = msg.message ? this.sce.trustAsHtml(msg.message) : this.sce.trustAsHtml(msg);
        this.open();
    },
    setTimer: function setTimer() {
        var _this = this;
        clearTimeout(_this.timer);
        _this.timer = setTimeout(function () {
            _this.show = false;
            if (!_this.scope.$$phase) _this.scope.$apply();
        }, 5000);
    }
};

export function estimateGas (dataObj, callback) {
    if (ajaxReq.estimateGas) {
        var gasLimit = 2000000;
        dataObj.gasPrice = '0x01';
        dataObj.gas = '0x' + new BigNumber(gasLimit).toString(16);
        ajaxReq.getTraceCall(dataObj, function (data) {
            if (data.error) {
                callback(data);
                return;
            }

            function recurCheckBalance(ops) {
                var startVal = 24088 + ops[0].cost;
                for (var i = 0; i < ops.length - 1; i++) {
                    var remainder = startVal - (gasLimit - ops[i].ex.used);
                    if (ops[i + 1].sub && ops[i + 1].sub.ops.length && gasLimit - ops[i + 1].cost > remainder) startVal += gasLimit - ops[i + 1].cost - startVal;else if (ops[i + 1].cost > remainder) startVal += ops[i + 1].cost - remainder;
                }
                if (!dataObj.to) startVal += 37000; //add 37000 for contract creation
                startVal = startVal == gasLimit ? -1 : startVal;
                return startVal;
            }
            if (data.data.vmTrace && data.data.vmTrace.ops.length) {
                var result = data.data.vmTrace.ops;
                var estGas = recurCheckBalance(result);
                estGas = estGas < 0 ? -1 : estGas + 5000;
            } else {
                var stateDiff = data.data.stateDiff;
                stateDiff = stateDiff[dataObj.from.toLowerCase()]['balance']['*'];
                if (stateDiff) var estGas = new BigNumber(stateDiff['from']).sub(new BigNumber(stateDiff['to'])).sub(new BigNumber(dataObj.value));else var estGas = new BigNumber(-1);
                if (estGas.lt(0) || estGas.eq(gasLimit)) estGas = -1;
            }
            callback({
                "error": false,
                "msg": "",
                "data": estGas.toString()
            });
        });
    } else {
        ajaxReq.getEstimatedGas(dataObj, function (data) {
            if (data.error) {
                callback(data);
                return;
            } else {
                callback({
                    "error": false,
                    "msg": "",
                    "data": new BigNumber(data.data).toString()
                });
            }
        });
    }
};
*/
