import { flatten } from '../utils/typeUtils';
import { addAtom } from '../utils/atomicUtils';
import { fillCssTemplate } from '../utils/cssUtils';

export const psuedoMap = {
  template: '&:$1 { $2 }',
  selectors: {
    hover: 'hover',
    active: 'active'
  }
};

// given a psuedo selector from psuedoMap.selectors, and a cssStr to
// associate with selector, return selector aware aware css string
// eg 'hover' -> 'margin: 0rem;' -> '&:hover { color: #margin: 0rem; };','
export const psuedoOutput = (selector, cssStr) =>
  fillCssTemplate([`${psuedoMap.selectors[selector]}`, cssStr ], psuedoMap.template);

// const addPseudoTag = pseudoOutput => assoc('tag', PSUDEO_TAG, pseudoOutput);

// Create a function that will apply styles at one of the selectors in psuedoMap.selectors
// The function returned recieves an atomic vector list (potentially nested), and returns a
// flattened atomic vector list represening the corresponding vectors applied at the specified selector
// '' -> ([ {av} &| [ {av} ]]) -> // [ {av} ]
export const makePsuedoFn = selector => (...atomicVectors) =>
  flatten(atomicVectors).map(v =>
    addAtom(v.atoms, v.type, `${selector}:${v.spec}`, psuedoOutput(selector, v.css)));

export const mapPseudoFns = psuedoMap =>
  Object.keys(psuedoMap.selectors).reduce((acc,sel)=>
    ({...acc, [sel]: makePsuedoFn(sel)}), {});
