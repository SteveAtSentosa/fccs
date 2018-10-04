import { isArrOrStr, arrayify } from './typeUtils';
import { cssKeyToVal } from './cssUtils';

// assumes keyMap is shaped like this: { unit: '', vals: { key: cssVal }}
export const makeKeyMapFn = keyMap => keys =>
  isArrOrStr(keys) ?
  arrayify(keys).map(key=>cssKeyToVal(key, keyMap.vals, keyMap.unit)) : [];
