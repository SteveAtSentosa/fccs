
export const isArr = toCheck => Array.isArray(toCheck);
export const isStr = toCheck => typeof toCheck === 'string';
export const isNum = toCheck => typeof toCheck === 'number';
export const isObj = toCheck => !isArr(toCheck) && typeof toCheck === 'object';
export const isFn = toCheck => typeof toCheck === 'function';
export const isUndef = toCheck => toCheck === undefined;
export const isNumOrStr = toCheck => isNum(toCheck) || isStr(toCheck);
export const isArrOrStr = toCheck => isArr(toCheck) || isStr(toCheck);
export const isArrOrObj = toCheck => isArr(toCheck) || isObj(toCheck);
export const isArrOrStrOrNum = toCheck => isArr(toCheck) || isStr(toCheck) || isNum(toCheck);
export const isNonEmptyStr = toCheck => isStr(toCheck) && toCheck.length > 0;
export const isNumOrNonEmptyStr = toCheck => isNum(toCheck) || isNonEmptyStr(toCheck);

export const toStr = toConvert => isStr(toConvert) ? toConvert : String(toConvert);
export const arrayify = input => isArr(input) ? input : [input];

export const noop = ()=>undefined;
export const reflect = v=>v;
export const arraifyAndReflect = v => arrayify(v);


// below belongs in dataUtils.js

export const capitalize = str =>
  str.charAt(0).toUpperCase() + str.slice(1);

// remove array duplicates (experimental, only works on arrays of built in types )
export const unique = toPrune =>
  isArr(toPrune) ? [...new Set(toPrune)] : toPrune;

export const flatten = arr =>
  arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);

// TODO: can get rid of this when I untag AV lists
// honors immutability
export const assoc = (propName, propVal, target) => {
  const updated =
    isObj(target) ? {...target} :
    isArr(target) ? [...target] : {};
  updated[propName] = propVal;
  return updated;
};

