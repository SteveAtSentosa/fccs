import { isArr } from '../utils/typeUtils';
import  { cssKeyToVal } from '../utils/cssUtils';

const spacingMap = {
  unit: 'rem',
  vals: {
    0: 0,
    1: 0.25,
    2: 0.5,
    3: 0.75,
    4: 1,
    5: 1.25,
    6: 1.5,
    8: 2,
    10: 2.5,
    12: 3,
    16: 4,
    20: 5,
    24: 6,
    32: 8,
  }
};


// e.g. mapSpacingKey([5]) //=> ['1.25rem']
// e.g. mapSpacingKey([4,6]) //=> ['1rem', 1.5rem']
// e.g. mapSpacingKey([99, {}]) //=> ['', ''] (unkown or invalid keys)
export const mapSpacingKeys = spacingKeys =>
  isArr(spacingKeys) ?
  spacingKeys.map(key=>cssKeyToVal(key, spacingMap.vals, spacingMap.unit)) : [];
