import { isObj, isStr, isNumOrStr, isUndef, toStr, isArr, unique } from './typeUtils';
import  { cssKeysToSpec, cssKeyToVal, fillCssTemplate } from './cssUtils';

// import { pickSpecEntry, assocSpecEntry, fillCssTemplate } from './cssUtils';

// atoms = {
//   pt : { <-- atom type
//     1:            'padding-top: 0.25rem', <-- an atom,  applied via atomic fxn pt(1)
//     2:            'padding-top: 0.5rem'   <-- another atom, applied via atomic fxn pt(2)
//     ^              ^                 ^
//     cssSpec        cssStr (css string or classname, depening upon definition of toClass())
//
//   c : { <-- a second atom type
//     red:           'color:     #c62828',  <-- an atom, applied via atomic fxn c('red')
//   }                ^cssProp    ^cssVal
// }

// atom tuple
// [ 'c',           'red',      'color: #c62828'];
//    ^atom type     ^cssSpec    ^cssStr


// TODO
// Index into atom Tuples
export const TYPE =  0;
export const SPEC = 1;
export const CSS = 2;
export const ATOMS = 3;
export const TAG = 4;

export const ATOMIC_TUPLE_TAG = '_@_atomic_tuple';
export const RX_TAG = '_@_rx';
export const PSUEDO_SEL_TAG = '_@_psuedo_sel';

// is atom input valid?
export const validAtomInput = (atoms, atomType, cssSpec) =>
  isObj(atoms) && isStr(atomType) && isNumOrStr(cssSpec);

// get an atom prop, assumes all input is valid.
// Make sure you do input type checking via validAtomInput()  before calling
export const atomProp = (atoms, atomType, cssSpec) =>  atoms[atomType][toStr(cssSpec)];

// does atom type exist?  (resistant to invalid input)
export const atomTypeExists = (atoms, atomType) =>
  isObj(atoms) && isStr(atomType) && isObj(atoms[atomType]);

// does an atom exist?  (resistant to invalid input)
export const atomExists = (atoms, atomType, cssSpec) =>
  validAtomInput(atoms, atomType, cssSpec) &&
  atomTypeExists(atoms, atomType) &&
  !isUndef(atomProp(atoms, atomType, cssSpec));

// Given an atomType and cssSpec return the corresponding atom cssStr
// Returns empty string if atom does not exist or on invalid input
// {} -> '' -> '' -> {atom}
export const getAtomCss = (atoms, atomType, cssSpec) =>
  atomExists(atoms, atomType, cssSpec) ? atomProp(atoms, atomType, cssSpec) : '';

// Given an an atomType and cssSpec return the  corresponding atom tuple
// [cssSpec, cssStr] tuple, or undefined if atom does not exist or on invalid input
// {} -> '' -> '' -> ['', ''] | undefined
export const getAtomTuple = (atoms, atomType, cssSpec) =>
  atomExists(atoms, atomType, cssSpec) ?
  [ atomType, toStr(cssSpec), atomProp(atoms, atomType, cssSpec), atoms, ATOMIC_TUPLE_TAG ] :
  undefined;

export const isAtomicTuple = toCheck =>
  isArr(toCheck) && toCheck.length >= 5 && toCheck[TAG] === ATOMIC_TUPLE_TAG;


// Given atomType, cssSpec and the corresponding cssStr
// add the atom to the atom object, or do nothing on invalid input
// Return the tuple for atom that was added or undefined on invalid input
// {} -> '' -> '' -> ''|number -> '' -> [tuple]
export const addAtom = (atoms, atomType, cssSpec, cssStr) => {
  if (!validAtomInput(atoms, atomType, cssSpec) || !isStr(cssStr)) return undefined;
  if (!atomTypeExists(atoms, atomType)) atoms[atomType] = {};
  atoms[atomType][cssSpec] = cssStr;
  return getAtomTuple(atoms, atomType, cssSpec);
};

// Serve an atomic request.
// If requested atom exists, return corresponding atomic tuple
// If requested atom doesn't exist, adds it and return corresponding atomic tuple
// Returns ??? on invalid input ???
export const atom = (atoms, atomType, mapCssKeysToValsFn, cssTemplate, cssKeys) => {
  const cssSpec = cssKeysToSpec(cssKeys);

  if (atomExists(atoms, atomType, cssSpec))
    return getAtomTuple(atoms, atomType, cssSpec);

  const cssStr = fillCssTemplate(mapCssKeysToValsFn(cssKeys), cssTemplate);
  return addAtom(atoms, atomType, cssSpec, cssStr);
};

// create a function which will accept 1 or more cssKeys as arguments
// will add the corresponding atom if needed, and will return the corresponding cssStr
export const makeAtomicFn = (atoms, atomType, mapCssKeysToValsFn, cssTemplate) =>
  (...cssKeys) => atom(atoms, atomType, mapCssKeysToValsFn, cssTemplate, cssKeys);

// TODO: move away from hard coded breakpoint fxns, define breakpoint fxns
// and breakpoints values on mapper object
export const rxSm = (...atomTuples) => {
  const results = atomTuples.map(tpl=>addAtom(
    tpl[ATOMS], tpl[TYPE], `sm:${tpl[SPEC]}`,
    `@media (min-width: 576px) { ${tpl[CSS]} };`));
  results.tag = RX_TAG;
  return results;
};

export const isRxOutput = toCheck =>
  isArr(toCheck) && toCheck.tag === RX_TAG;

// input: css tuple, or rx result
// output: list of corresponding cssStr's
export const fcx = (...cssInput) =>
  cssInput.reduce((acc, cssIn)=>
    isAtomicTuple(cssIn) ? [...acc, cssIn[CSS]] :
    isRxOutput(cssIn) ? [...acc, ...cssIn.map(t=>t[CSS])] :
    acc, []);


// TODO: move to atomUtils?

// export const cssMap = {

//   padding:       { atomType: 'p',  cssTemplate: 'padding: $1 $2 $3 $4', mapFn: mapSpacingKeys },
//   paddingTop:    { atomType: 'pt', cssTemplate: 'padding-top: $1',      mapFn: mapSpacingKeys },

export const mapAtomicFns = (atoms, atomicFns, cssMap) => {
  console.log('~~> mapAtomicFns()');
  isObj(cssMap) &&
  Object.keys(cssMap).map(fspec=>{
    console.log('fspec: ', fspec);
    const { atomType, cssTemplate, mapFn } = cssMap[fspec];

    console.log('atomType: ', atomType);
    console.log('cssTemplate: ', cssTemplate);
    console.log('mapFn: ', mapFn);

    atomicFns[atomType] = makeAtomicFn(atoms, atomType, mapFn, cssTemplate);
  });
};

// padding:       { atomType: 'p',  cssTemplate: 'padding: $1 $2 $3 $4', mapFn: mapSpacingKeys },