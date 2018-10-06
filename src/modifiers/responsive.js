import { flatten, capitalize  } from '../utils/typeUtils';
import { addAtom } from '../utils/atomicUtils';
import { fillCssTemplate } from '../utils/cssUtils';

export const rxMap = {
  template: '@media (min-width: $1) { $2 }',
  unit: 'px',
  fnPrefix: 'rx',
  breakPts: {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
  }
};

// given a break point from rxMap.breakPts, and a cssStr to associate with the breakpoint
// return breakpoint aware css string
// eg 'md' -> 'margin: 0rem;' -> '@media (min-width: 768px) { margin: 0rem; };'
export const responsiveOutput = (breakPt, cssStr) =>
  fillCssTemplate([`${rxMap.breakPts[breakPt]}${rxMap.unit}`, cssStr], rxMap.template);

// const addRxTag = rxOutput => assoc('tag', RX_TAG, rxOutput);

// Create a function that will apply styles at one of the breakpoints in rxMap.breakPts
// The function returned recieves an atomic vector list (potentially nested), and returns a
// flattened atomic vector list representing the corresponding vectors applied at the specified breakPt
// '' -> ([ {av} &| [ {av} ]]) -> // [ {av} ]
export const makeResponsiveFn = breakPt => (...atomicVectors) =>
  flatten(atomicVectors).map(v=>
    addAtom(v.atoms, v.type, `${breakPt}:${v.spec}`, responsiveOutput(breakPt, v.css)));


export const mapResponsiveFns = rxMap =>
  Object.keys(rxMap.breakPts).reduce((acc,bp)=>
    ({...acc, [`${rxMap.fnPrefix}${capitalize(bp)}`]: makeResponsiveFn(bp)}), {});

