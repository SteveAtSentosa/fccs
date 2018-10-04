import { flatten } from 'ramda';
import { isArr, isNum, isObj, arrayify } from './typeUtils';
import { cssKeysToSpec, fillCssTemplate } from './cssUtils';
import { ATOMIC_V_TAG } from './atomicUtils';


// { type: 't', spec, 's', css, 'c' } => { t: { s: c }}
export const vectorToAtom = v => ({ [v.type]: {  [v.spec]: v.css }});

export const genCss = (cssKeys, cssProp, atomicMap) => {
  const cssVals = flatten(arrayify(cssKeys).map(k=>atomicMap[cssProp].mapFn(k)));
  return fillCssTemplate(cssVals, atomicMap[cssProp].cssTemplate);
};

// make an object that fully describes input and output for atomic requests
export const makeTestSpec = (testAtoms, keyMap, atomicMap, cssProp, cssKeys) => ({
  cssProp,
  fn: atomicMap[cssProp].atomType,
  cssKeys: arrayify(cssKeys),
  type: atomicMap[cssProp].atomType,
  template: atomicMap[cssProp].cssTemplate,
  mapFn: atomicMap[cssProp].mapFn,
  expectCss: genCss(cssKeys, cssProp, atomicMap),
  expectVector: { // atomic vector expected as output to an atomic request
    type: atomicMap[cssProp].atomType,
    spec: cssKeysToSpec(arrayify(cssKeys)),
    css: genCss(cssKeys, cssProp, atomicMap),
    atoms: testAtoms,
    tag: ATOMIC_V_TAG,
  }
});

// generate list of valid css Keys for a keyMap and atomic map,
// length between 1 and num of slots in the template
export const randomCssKeyList = (keyMap, atomicMap, cssProp) =>
  sampleKeys(keyMap.vals, randNumTemplateSlots(atomicMap[cssProp].cssTemplate));


// return at random sample from an array
export const getListSample = list =>
  isArr(list) ? list[Math.floor(Math.random() * list.length)] : undefined;

// return at list of random samples from list, with numSamples entries
export const sampleList = (list, numSamples) => {
  if (!isArr(list) || !isNum(numSamples)) return [];
  let samples = [];
  while (samples.length < numSamples) {
    samples.push(getListSample(list));
  }
  return samples;
};

// return at list of randomly samples keys from obj, with numSamples entries
export const sampleKeys = (obj, numSamples) =>
  !isObj(obj) || !isNum(numSamples) ? [] :
  sampleList(Object.keys(obj), numSamples);

export const randNum = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;


// return number of templates slotes in a css template (i.e. the # of $)
export const numTemplateSlots = template =>
  (template.match(/\$/g) || []).length;


// return a random number between 1 and slots in a template string
export const randNumTemplateSlots = template =>
  randNum(1, numTemplateSlots(template));


