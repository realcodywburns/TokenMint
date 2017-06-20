
export function required(value) {
  return value ? null : 'error';
}

export function number(value) {
    return parseInt(value, 10) > 0 ? null : 'error';
}