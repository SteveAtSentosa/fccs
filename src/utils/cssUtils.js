import { isArr, isStr, isArrOrStr, toStr, isObj, isUndef, isNumOrStr, arrayify } from './typeUtils';

// given a css value or an array of css values and a css template string, fill the
// template string with the css values.  Trim away any unused template slots and append ';'
// e.g. fillCssTemplate(['2px', '3px'], 'padding: $1 $2 $3 $4') //=> 'padding: 2px 3px;'
// [''] | '' -> '' -> ''
export const fillCssTemplate = (cssVals, cssTemplate) =>
  !isArrOrStr(cssVals) || !isStr(cssTemplate) ? '' :
  arrayify(cssVals).reduce((acc, cssVal, i) =>
    acc.replace(new RegExp(`\\$${i+1}`, 'g'), cssVal), cssTemplate).split(/ *\$/)[0].trim().concat(';');

// Given a key and css map, return the cssvalue at the key, with postPend
// (usually css unit) appended. Returns empty string on no match or invalid input
// '' -> {} -> '' -> a
export const cssKeyToVal = (cssKey, map, postPend='') =>
  isNumOrStr(cssKey) && isObj(map) && !isUndef(map[toStr(cssKey)]) ?
  `${map[toStr(cssKey)]}${postPend}` : '';

// Given a list of css keys, construct the corresponding cssSpec
// e.g. cssKeysToSpec([8]); //=> '8'
// e.g. cssKeysToSpec([1,2,2,1]); //=> '1:2:2:1'
// e.g. cssKeysToSpec(['red:100']); //=> 'red:100'
// e.g. cssKeysToSpec({invalid: 'input'); //=> ''
export const cssKeysToSpec = cssKeys =>
  !isArr(cssKeys) ? '' :
  cssKeys.reduce((acc,key,i)=>`${acc}${i===0?'':':'}${toStr(key)}` ,'');
