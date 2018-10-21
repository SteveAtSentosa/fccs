import  {  expect } from 'chai';
import { mergeDeepRight, flatten } from 'ramda';
import { isStr, isUndef } from '../../src/utils/typeUtils';
import { vectorToAtom, makeTestSpec } from '../../src/utils/testUtils';
import { mapColorKeys, shades, colors, colorAtomicMap } from '../../src/maps/color';
import { ATOMIC_V_TAG, atom } from '../../src/utils/atomicUtils';

export default function runColorTests() {
  describe('Atomoic request tests', ()=>{
    testColorMapping();
    testColorRequests();
  });
}

//*************************************************************************************************
function testColorMapping() {
//*************************************************************************************************
  describe('color mapping', ()=> {

    it('should map color keys correctly',()=>{
      expect(mapColorKeys('red')).to.deep.equal(['#c62828']);
      expect(mapColorKeys('red:50')).to.deep.equal(['#ffebee']);
      expect(mapColorKeys(['red:a700'])).to.deep.equal(['#d5000']);
      expect(mapColorKeys('grey:200')).to.deep.equal(['#eeeeee']);
      expect(mapColorKeys('deepPurple:a700')).to.deep.equal(['#6200e']);
      expect(mapColorKeys('cyan:500')).to.deep.equal(['#00bcd4']);

    });
    it('should handle invalid color mapping input correctly',()=>{
      expect(mapColorKeys('blue:xxx')).to.deep.equal(['#1565c0']);
      expect(mapColorKeys('nocolor')).to.deep.equal(['']);
    });
  });
}

//*************************************************************************************************
function testColorRequests() {
//*************************************************************************************************
  describe('color requests', ()=> {

    it('should handle color requests correctly',()=>{

      const atoms = {};
      let atomRef = {};

      // tests with hard coded input/results, independent of utils
      // These are useful because the code being tested use the utils that these tests do not, so some independent validation is important
      // The downside is if the maps are changed, these tests will have to be updated, and full coverage would be difficult

      const cTemplate = 'color: $1';
      const bgcTempalte = 'background-color: $1';
      const bcTemplate = 'border-color: $1';

      let expectVec = {};

      expectVec = { type: 'c', spec: 'red', css: 'color: #c62828;', atoms, tag: ATOMIC_V_TAG};
      expect(atom(atoms, 'c', mapColorKeys, cTemplate, 'red')).to.deep.equal(expectVec);
      atomRef = mergeDeepRight(atomRef, vectorToAtom(expectVec));
      expect(atoms).deep.equal(atomRef);

      expectVec = { type: 'c', spec: 'red:50', css: 'color: #ffebee;', atoms, tag: ATOMIC_V_TAG};
      expect(atom(atoms, 'c', mapColorKeys, cTemplate, ['red:50'])).to.deep.equal(expectVec);
      atomRef = mergeDeepRight(atomRef, vectorToAtom(expectVec));
      expect(atoms).deep.equal(atomRef);

      expectVec = { type: 'c', spec: 'grey:a300', css: 'color: #757575;', atoms, tag: ATOMIC_V_TAG};
      expect(atom(atoms, 'c', mapColorKeys, cTemplate, ['grey:a300'])).to.deep.equal(expectVec);
      atomRef = mergeDeepRight(atomRef, vectorToAtom(expectVec));
      expect(atoms).deep.equal(atomRef);

      expectVec = { type: 'bgc', spec: 'cyan:a100', css: 'background-color: #84ffff;', atoms, tag: ATOMIC_V_TAG};
      expect(atom(atoms, 'bgc', mapColorKeys, bgcTempalte, 'cyan:a100')).to.deep.equal(expectVec);
      atomRef = mergeDeepRight(atomRef, vectorToAtom(expectVec));
      expect(atoms).deep.equal(atomRef);

      expectVec = { type: 'bc', spec: 'white', css: 'border-color: #ffffff;', atoms, tag: ATOMIC_V_TAG};
      expect(atom(atoms, 'bc', mapColorKeys, bcTemplate, 'white')).to.deep.equal(expectVec);
      atomRef = mergeDeepRight(atomRef, vectorToAtom(expectVec));
      expect(atoms).deep.equal(atomRef);

      // Tests that rely on some utils that are also used by code under test.
      // This is so that we carry out extensive data driven testing

      const fullColorMap = makeFullColorMap(shades, colors);
      const makeColorTest = (cssProp, colorKey) => makeTestSpec(atoms, fullColorMap, colorAtomicMap, cssProp, colorKey);

      // const t = makeColorTest('color', 'red:100');
      // console.log('t: ', t);
      // expect(atom(atoms, t.type, t.mapFn, t.template, t.cssKeys)).to.deep.equal(t.expectVector);

      // constrct tests for all color atoms
      const tests = flatten(Object.keys(colorAtomicMap).map(cssProp =>
        Object.keys(fullColorMap.vals).map(cssKey=>makeColorTest(cssProp, cssKey))));

      tests.map(t=> {
        expect(atom(atoms, t.type, t.mapFn, t.template, t.cssKeys)).to.deep.equal(t.expectVector);
        atomRef = mergeDeepRight(atomRef, vectorToAtom(t.expectVector));
        expect(atoms).deep.equal(atomRef);
        return null;
      });
    });

    it('should handle invalid color requests correctly',()=>{
      const atoms = {};
      const bgcTempalte = 'background-color: $1';
      expect(atom([atoms], 'bgc', mapColorKeys, bgcTempalte, 'cyan:a100')).to.deep.equal(undefined);
      expect(atom(atoms, {bgc:'bgc'}, mapColorKeys, bgcTempalte, 'cyan:a100')).to.deep.equal(undefined);
      expect(atom(atoms, 'bgc', [mapColorKeys], bgcTempalte, 'cyan:a100')).to.deep.equal(undefined);
      expect(atom(atoms, 'bgc', mapColorKeys, {b:bgcTempalte}, 'cyan:a100')).to.deep.equal(undefined);
      expect(atom(atoms, 'bgc', mapColorKeys, bgcTempalte, {a:1})).to.deep.equal(undefined);
      expect(atoms).deep.equal({});
    });
  });
}

//*************************************************************************************************
// Helper functions
//*************************************************************************************************

const expandColor = (shades, colors, color) =>
  isStr(colors[color]) ? { [color]: colors[color] } :
  shades.reduce((acc,shade,i)=>({
    ...acc,
    ...!isUndef(colors[color].range[i]) ? {[`${color}:${shade}`]: colors[color].range[i]} : {}
  }) , {});

const makeFullColorMap = (shades, colors) => {
  const map = { unit:'', vals: {}};
  map.vals = Object.keys(colors).reduce((acc,color)=>({
    ...acc,
    ...expandColor(shades, colors, color)
  }),{});
  return map;
};

