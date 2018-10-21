import { isArrOrStr, arrayify, flatten } from './typeUtils';
import { cssKeyToVal } from './cssUtils';

// TODO: enable single arg, array of args, or multiple args to be passed in
// (...keys) => flatten(keys) kind of thing (see theme mapper)

// assumes keyMap is shaped like this: { unit: '', vals: { key: cssVal }}
export const makeKeyMapFn = keyMap => keys =>
  isArrOrStr(keys) ?
  arrayify(keys).map(key=>cssKeyToVal(key, keyMap.vals, keyMap.unit)) : [];

