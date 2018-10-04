import { isArr, assoc } from '../utils/typeUtils';
import { addAtom } from '../utils/atomicUtils';
import { fillCssTemplate } from '../utils/cssUtils';

const rxMap = {
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

const RX_TAG = '_@_rx';

export const isRxOutput = toCheck =>
  isArr(toCheck) && toCheck.tag === RX_TAG;

export const responsiveOutput = (breakPt, atomicVector) =>
  fillCssTemplate([`${rxMap.breakPts[breakPt]}${rxMap.unit}`, atomicVector.css], rxMap.template);

const addRxTag = rxOutput => assoc('tag', RX_TAG, rxOutput);

export const makeResponsiveFn = breakPt => (...atomicVectors) => addRxTag(
  atomicVectors.map(v=>addAtom(v.atoms, v.type, `${breakPt}:${v.spec}`, responsiveOutput(breakPt, v))));

export const rxSm = makeResponsiveFn('sm');

// export const rxSm = (...atomicVectors) => addRxTag(
//   atomicVectors.map(v=>addAtom(v.atoms, v.type, `sm:${v.spec}`, responsiveOutput('sm', v))));

export const makeReponsiveFns = () => null;
// Object.keys(rxMap.breakPts).reduce((acc,bp)=> {
//   const cssT = rxMap.template;
//   console.log('rxMap.breakPts[bp]: ', `${rxMap.breakPts[bp]}${rxMap.unit}`);
//   const css = fillCssTemplate([
//     `${rxMap.breakPts[bp]}${rxMap.unit}`
//   ], cssT);
//   console.log('cssT: ', cssT);
//   console.log('css: ', css);


//   return acc;
// }
// , '{}');


//export const fillCssTemplate = (cssVals, cssTemplate) =>



// { type: atomType, spec: cssSpec,
//   css: atomProp(atoms, atomType, cssSpec), atoms, tag: ATOMIC_V_TAG } : undefined;


// export const addAtom = (atoms, atomType, cssSpec, cssStr) => {
//   if (!validAtomInput(atoms, atomType, cssSpec) || !isStr(cssStr)) return undefined;
//   atomAssoc(atoms, atomType, cssSpec, cssStr);
//   return getAtomicVector(atoms, atomType, cssSpec);
// };

// // Serve an atomic request.
// // If requested atom exists, return corresponding atomic vector
// // If requested atom doesn't exist, adds it and return corresponding atomic vector
// // Returns ??? on invalid input ???
// export const atom = (atoms, atomType, mapCssKeysToValsFn, cssTemplate, cssKeys) => {


// // TODO: move away from hard coded breakpoint fxns, define breakpoint fxns
// // and breakpoints values on mapper object
// export const rxSm = (...atomTuples) => {
//   const results = atomTuples.map(tpl=>addAtom(
//     tpl[ATOMS], tpl[TYPE], `sm:${tpl[SPEC]}`,
//     `@media (min-width: 576px) { ${tpl[CSS]} };`));
//   results.tag = RX_TAG;
//   return results;
// };

// export const isRxOutput = toCheck =>
//   isArr(toCheck) && toCheck.tag === RX_TAG;

