import ethUtil from 'ethereumjs-util';
import BigNumber from 'bignumber.js';

export function getRandomBytes(num) {
    return ethUtil.crypto.randomBytes(num);
}

export function hexToAscii(hex) {
    return hex.match(/.{1,2}/g).map(function(v) {
        return String.fromCharCode(parseInt(v, 16));
    }).join('');
}

export function sanitizeHex(hex) {
    hex = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex;
    if (hex === "") return "";
    return '0x' + padLeftEven(hex);
}

export function padLeftEven(hex) {
    hex = hex.length % 2 !== 0 ? '0' + hex : hex;
    return hex;
}

export function decimalToHex(dec) {
    return new BigNumber(dec).toString(16);
}

export function hexToDecimal(hex) {
    return new BigNumber(sanitizeHex(hex)).toString();
}

export function contractOutToArray(hex) {
    hex = hex.replace('0x', '').match(/.{64}/g);
    for(var i=0;i<hex.length;i++){
        hex[i] = hex[i].replace(/^0+/, '');
        hex[i] = hex[i] === "" ? "0" : hex[i]; 
    }
    return hex;
}

export function getNakedAddress(address) {
    return address.toLowerCase().replace('0x', '');
}

export function getDeterministicContractAddress(address, nonce) {
    address = address.substring(0, 2) === '0x' ? address : '0x' + address;
    return '0x' + ethUtil.sha3(ethUtil.rlp.encode([address, nonce])).slice(12).toString('hex');
}
export function padLeft(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
export function getDataObj(to, func, arrVals) {
    var val="";
    for(var i=0;i<arrVals.length;i++) val+=padLeft(arrVals[i],64);
    return {to: to, data: func+val};
}
export function getFunctionSignature (name) {
    return ethUtil.sha3(name).toString('hex').slice(0, 8);
};