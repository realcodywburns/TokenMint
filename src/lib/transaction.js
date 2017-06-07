import ethUtil from 'ethereumjs-util';
import ethTx from 'ethereumjs-tx';
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
*/