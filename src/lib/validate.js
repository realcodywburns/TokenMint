import ethUtil from 'ethereumjs-util';

export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export function validateEtherAddress(address) {
    if (address.substring(0, 2) !== "0x") return false;
    else if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) return false;
    else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) return true;
    else
    return this.isChecksumAddress(address);
}

export function isChecksumAddress(address) {
    return address === ethUtil.toChecksumAddress(address);
}

export function validateHexString(str) {
    if (str === "") return true;
    str = str.substring(0, 2) === '0x' ? str.substring(2) : str;
    var re = /[0-9A-Fa-f]+$/g;
    return re.test(str);
}
