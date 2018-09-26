
export const isArr = toCheck => Array.isArray(toCheck);
export const isStr = toCheck => typeof toCheck === 'string';
export const isNum = toCheck => typeof toCheck === 'number';
export const isObj = toCheck => !isArr(toCheck) && typeof toCheck === 'object';
export const isUndef = toCheck => toCheck === undefined;
export const isNumOrStr = toCheck => isNum(toCheck) || isStr(toCheck);
export const toStr = toConvert => isStr(toConvert) ? toConvert : String(toConvert);
export const arrayify = input => isArr(input) ? input : [input];

// remove array duplicates (experimental, only works on arrays of built in types )
export const unique = toPrune =>
  isArr(toPrune) ? [...new Set(toPrune)] : toPrune;

// ['t0', 't1', 't3'] => { t0: { t1: t2 }}
export const tupleToObj = tuple => ({ [toStr(tuple[0])]: { [toStr(tuple[1])]: tuple[2] }});

