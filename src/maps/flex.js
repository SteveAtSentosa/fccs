// experimental & incomplete

import { isArr } from '../utils/typeUtils';
import  { cssKeyToVal } from '../utils/cssUtils';

const flexMap = {
  row: 'row',
  rrow: 'reverse-row',
  col: 'column',
  rcol: 'reverse-column',
  wrap: 'wrap',
  nowrap: 'nowrap',
  rwrap: 'reverse-wrap'
};

export const mapFlexKeys = flexKeys =>
  isArr(flexKeys) ?
  flexKeys.map(key=>cssKeyToVal(key, flexMap)) : [];
