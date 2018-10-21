import { isObj, isStr, arrayify, isNumOrNonEmptyStr, isUndef, toStr, isNonEmptyStr, isArrOrStrOrNum, isFn, reflect, flatten } from './typeUtils';
import  { cssKeysToSpec, fillCssTemplate } from './cssUtils';

// import { pickSpecEntry, assocSpecEntry, fillCssTemplate } from './cssUtils';

// atoms = {
//   pt : { <-- atom type
//     1:            'padding-top: 0.25rem', <-- an atom,  applied via atomic fxn pt(1)
//     2:            'padding-top: 0.5rem'   <-- another atom, applied via atomic fxn pt(2)
//     ^              ^
//     cssSpec        cssStr (css string or classname, depening upon definition of toClass())
//
//   c : { <-- a second atom type
//     red:           'color:     #c62828',  <-- an atom, applied via atomic fxn c('red')
//   }                ^cssProp    ^cssVal
// }

// atomic vector: all info needed to add modifiers to an atom (hover, responsive breakpoints, etc)
// { atomType, spec, css, atoms }

export const ATOMIC_V_TAG = '_@_atomic_vector';

// is atom input valid?
// {} -> '' -> '' -> bool
export const validAtomInput = (atoms, atomType, cssSpec) =>
  isObj(atoms) && isNonEmptyStr(atomType) && isNumOrNonEmptyStr(cssSpec);

// get an atom prop, assumes all input is valid.
// Make sure you do input type checking via validAtomInput()  before calling
// {} -> '' -> '' -> 'cssStr'
export const atomProp = (atoms, atomType, cssSpec) =>  atoms[atomType][toStr(cssSpec)];

// does atom type exist?  (resistant to invalid input)
// {} -> '' -> bool
export const atomTypeExists = (atoms, atomType) =>
  isObj(atoms) && isNonEmptyStr(atomType) && isObj(atoms[atomType]);

// associate an atomic property
// {} -> '' -> '' -> '' -> n/a
export const atomAssoc = (atoms, atomType, cssSpec, cssStr) => {
  if (!atomTypeExists(atoms, atomType)) atoms[atomType] = {};
  atoms[atomType][cssSpec] = cssStr;
};

// does an atom exist?  (resistant to invalid input)
// {} -> '' -> '' -> bool
export const atomExists = (atoms, atomType, cssSpec) =>
  validAtomInput(atoms, atomType, cssSpec) &&
  atomTypeExists(atoms, atomType) &&
  !isUndef(atomProp(atoms, atomType, cssSpec));

// Given an atomType and cssSpec return the corresponding atom cssStr
// Returns empty string if atom does not exist or on invalid input
// {} -> '' -> '' -> 'cssStr'
export const getAtomCss = (atoms, atomType, cssSpec) =>
  atomExists(atoms, atomType, cssSpec) ? atomProp(atoms, atomType, cssSpec) : '';

// Given an an atomType and cssSpec return the  corresponding atomic vector
// or undefined if atom does not exist or on invalid input
export const getAtomicVector = (atoms, atomType, cssSpec) =>
  atomExists(atoms, atomType, cssSpec) ?
    { type: atomType, spec: cssSpec, css: atomProp(atoms, atomType, cssSpec), atoms, tag: ATOMIC_V_TAG } :
    undefined;

export const isAtomicVector = toCheck =>
  isObj(toCheck) && toCheck.tag === ATOMIC_V_TAG;

// Given atomType, cssSpec and the corresponding cssStr
// add the atom to the atom object, or do nothing on invalid input
// Return the vector for atom that was added or undefined on invalid input
// {} -> '' -> '' -> ''|number -> '' -> {av} | undefined
export const addAtom = (atoms, atomType, cssSpec, cssStr) => {
  if (!validAtomInput(atoms, atomType, cssSpec) || !isStr(cssStr)) return undefined;
  atomAssoc(atoms, atomType, cssSpec, cssStr);
  return getAtomicVector(atoms, atomType, cssSpec);
};

// Serve an atomic request.
// If requested atom exists, return corresponding atomic vector
// If requested atom doesn't exist, adds it and return corresponding atomic vector
// Return undefined in invalid input
// {} -> '' -> () '' -> [''] -> {av} | undefined
export const atom = (atoms, atomType, mapCssKeys, cssTemplate, cssKeys) => {

  if (!isObj(atoms) || !isStr(atomType) || !isStr(cssTemplate) || !isArrOrStrOrNum(cssKeys) || !isFn(mapCssKeys))
    return undefined;

  const cssSpec = cssKeysToSpec(arrayify(cssKeys));

  if (atomExists(atoms, atomType, cssSpec))
    return getAtomicVector(atoms, atomType, cssSpec);

  const cssStr = fillCssTemplate(mapCssKeys(arrayify(cssKeys)), cssTemplate);
  return addAtom(atoms, atomType, cssSpec, cssStr);
};

// create a function which will accept 1 or more cssKeys and/or themeProps as arguments, and returns corresponding atomic vector
// {} -> '' -> () '' -> (['cssKeys &| 'themeProps]) -> {av}
export const makeAtomicFn = (atoms, atomType, mapCssKeys, cssTemplate, mapThemeProps=reflect) =>
  (...cssKeys) => atom(atoms, atomType, mapCssKeys, cssTemplate, mapThemeProps(cssKeys));

// Receives an atomic vector list consisting of atomic vectors, or nested atomic vector lists
// The supplied list can contain lists nested to any level
// Returns list of corresponsing cssStr's
// [ {av} &| [ {av} ]] => ['cssStr']
export const fcx = (...atomicVectors) => flatten(atomicVectors).map(vec=>vec.css);

// Given an atomic map, return object containing corresponding atomic functions
// {} -> {} -> {}
export const mapAtomicFns = (atoms, atomicMap) =>
  !isObj(atoms) || !isObj(atomicMap) ? {} :
  Object.keys(atomicMap).reduce((acc,cssProp)=>{
    const { atomType, cssTemplate, mapFn } = atomicMap[cssProp];
    return {...acc, [atomType]: makeAtomicFn(atoms, atomType, mapFn, cssTemplate)};
  }, {});

