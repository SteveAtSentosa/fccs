import  {  expect } from 'chai';
import { mergeDeepRight } from 'ramda';
import { mapSpacingKeys, spacingKeyMap, spacingAtomicMap } from '../../src/maps/spacing';
import { mapFlexKeys } from '../../src/maps/layout';
// import { cssMap } from '../../src/maps/css';
import { cssKeysToSpec, fillCssTemplate } from '../../src/utils/cssUtils';
import { vectorToAtom, sampleKeys, numTemplateSlots, randNumTemplateSlots } from '../../src/utils/testUtils';

import {
  ATOMIC_V_TAG,
  validAtomInput, getAtomCss, atomProp, atomExists, mapAtomicFns,
  getAtomicVector, addAtom, atom, makeAtomicFn, fcx, rxSm }
  from '../../src/utils/atomicUtils';

export default function runAtomicRequestTests() {
  describe('Atomoic request tests', ()=>{
    testSpacingRequests();
    // testAtomicFunctions();
    // testReactiveAtoms();
    // testAtomicTransformer();
    // testAtomFnMapping();
  });
}



// make an object that fully describes input and output for atomic requests
const makeTestSpec = (testAtoms, keyMap, atomicMap, cssProp, cssKeys) => ({
  test: {
    cssProp,
    cssKeys,
    numKeys: cssKeys.length,
    type: atomicMap[cssProp].atomType,
    template: atomicMap[cssProp].cssTemplate,
    mapFn: atomicMap[cssProp].mapFn
  },
  expectVector: { // atomic vector expected as output to an atomic request
    type: atomicMap[cssProp].atomType,
    spec: cssKeysToSpec(cssKeys),
    css: fillCssTemplate(cssKeys.map(k=>`${keyMap.vals[k]}${keyMap.unit}`), atomicMap[cssProp].cssTemplate),
    atoms: testAtoms,
    tag: ATOMIC_V_TAG,
  }
});

// generate list of valid css Keys for a keyMap and atomic map,
// length between 1 and num of slots in the template
const randomCssKeyList = (keyMap, atomicMap, cssProp) =>
  sampleKeys(keyMap.vals, randNumTemplateSlots(atomicMap[cssProp].cssTemplate));


function testSpacingRequests() {
  describe('atomic spacing requests', ()=> {

    it('should serve atom spacing requests correctly',()=>{

      let atoms = {};
      let atomRef = {};


      // tests with hard coded input/results, independent of utils
      // These are useful because the code being tested use the same utils, so some independent validation is important
      // The downside is if the maps are changed, these tests will have to be updated, and full coverage would be difficult

      const padTemplate = 'padding: $1 $2 $3 $4';
      const padBotTemplate = 'padding-bottom: $1';
      const mrgVertTmplt = 'margin: $1 0';
      let expectVec = {};

      expectVec = { type: 'p', spec: '1', css: 'padding: 0.25rem;', atoms, tag: ATOMIC_V_TAG};
      expect(atom(atoms, 'p', mapSpacingKeys, padTemplate, [1])).to.deep.equal(expectVec);
      atomRef = mergeDeepRight(atomRef, vectorToAtom(expectVec));
      expect(atoms).deep.equal(atomRef);

      expectVec = { type: 'p', spec: '0:4:12:24', css: 'padding: 0rem 1rem 3rem 6rem;', atoms, tag: ATOMIC_V_TAG};
      expect(atom(atoms, 'p', mapSpacingKeys, padTemplate, [0, 4, 12, 24])).to.deep.equal(expectVec);
      atomRef = mergeDeepRight(atomRef, vectorToAtom(expectVec));
      expect(atoms).deep.equal(atomRef);

      expectVec = { type: 'pb', spec: '3', css: 'padding-bottom: 0.75rem;', atoms, tag: ATOMIC_V_TAG};
      expect(atom(atoms, 'pb', mapSpacingKeys, padBotTemplate, [3])).to.deep.equal(expectVec);
      atomRef = mergeDeepRight(atomRef, vectorToAtom(expectVec));
      expect(atoms).deep.equal(atomRef);

      expectVec = { type: 'mv', spec: '0', css: 'margin: 0rem 0;', atoms, tag: ATOMIC_V_TAG};
      expect(atom(atoms, 'mv', mapSpacingKeys, mrgVertTmplt, ['0'])).to.deep.equal(expectVec);
      atomRef = mergeDeepRight(atomRef, vectorToAtom(expectVec));
      expect(atoms).deep.equal(atomRef);


      // Tests that rely on some utils also used by code under test.
      // This is so that we carry out extensive data driven testing

      const makeSpacingTest = (cssProp, cssKeys) => makeTestSpec(atoms, spacingKeyMap, spacingAtomicMap, cssProp, cssKeys);
      const randomSpackingKeyList = cssProp => randomCssKeyList(spacingKeyMap, spacingAtomicMap, cssProp);

      // Run tests for all spacing atomic calls.
      // Loop over the test set because random number of css keys are used each test run, and we want to hit them all
      let numRunsLeft = 20;
      let tests = [];
      while (numRunsLeft > 0) {
        tests = Object.keys(spacingAtomicMap).map(cssProp => makeSpacingTest(cssProp, randomSpackingKeyList(cssProp)));
        tests.map(t=> {
          expect(atom(atoms, t.type, t.mapFn, t.template, t.cssKeys)).to.deep.equal(t.expectVector);
          atomRef = mergeDeepRight(atomRef, vectorToAtom(t.expectVector));
          expect(atoms).deep.equal(atomRef);
        });
        numRunsLeft--;
      }
    });


    it('should handle invalid atom spacing requests correctly',()=>{

      // const atoms = {};

      // These pass should fail
      // expect(atom(atoms, {}, mapSpacingKeys, mrgVertTmplt, [0])).to.equal('');
      // expect(atom(atoms, 'pb', mapSpacingKeys, {}, [3])).to.equal('');
      // expect(atoms).deep.equal(atomRef);
      // expect(atom(atoms, 'pb', mapSpacingKeys, pb, 3)).to.equal('');
      // expect(atom(atoms, 'mv', 'mv', mv, [0])).to.equal('margin: 0rem 0;');
      // console.log(atoms);
    });
  });
}

function testAtomicFunctions() {
  describe('atomic functions', ()=> {

    const padTemplate = 'padding: $1 $2 $3 $4';
    const mrgVertTmplt = 'margin: $1 0';
    const fxfTmplt = 'flex-flow: $1 $2';

    it('should create atomic functions correctly',()=>{
      const atoms = {};
      let atomRef = {};

      const atomicFns = {};
      atomicFns['p'] = makeAtomicFn(atoms, 'p', mapSpacingKeys, padTemplate);
      atomicFns['mv'] = makeAtomicFn(atoms, 'mv', mapSpacingKeys, mrgVertTmplt);
      atomicFns['fxf'] = makeAtomicFn(atoms, 'fxf', mapFlexKeys, fxfTmplt);
      const { p, mv, fxf } = atomicFns;

      // expect(p(0)).to.deep.equal(['p', '0', 'padding: 0rem;', atoms, ATOMIC_TUPLE_TAG ]);
      // atomRef = mergeDeepRight(atomRef, tupleToObj(['p', '0', 'padding: 0rem;']));
      // expect(atoms).deep.equal(atomRef);

      // expect(p(5,6,8,10)).to.deep.equal(['p', '5:6:8:10', 'padding: 1.25rem 1.5rem 2rem 2.5rem;', atoms, ATOMIC_TUPLE_TAG ]);
      // atomRef = mergeDeepRight(atomRef, tupleToObj(['p', '5:6:8:10', 'padding: 1.25rem 1.5rem 2rem 2.5rem;']));
      // expect(atoms).deep.equal(atomRef);

      // expect(mv(20)).to.deep.equal(['mv', '20', 'margin: 5rem 0;', atoms, ATOMIC_TUPLE_TAG ]);
      // atomRef = mergeDeepRight(atomRef, tupleToObj(['mv', '20', 'margin: 5rem 0;']));
      // expect(atoms).deep.equal(atomRef);

      // expect(fxf('row', 'wrap')).to.deep.equal(['fxf', 'row:wrap', 'flex-flow: row wrap;', atoms, ATOMIC_TUPLE_TAG ]);
      // atomRef = mergeDeepRight(atomRef, tupleToObj(['fxf', 'row:wrap', 'flex-flow: row wrap;']));
      // expect(atoms).deep.equal(atomRef);

      // expect(fxf('col', 'rwrap')).to.deep.equal(['fxf', 'col:rwrap', 'flex-flow: column reverse-wrap;', atoms, ATOMIC_TUPLE_TAG ]);
      // atomRef = mergeDeepRight(atomRef, tupleToObj(['fxf', 'col:rwrap', 'flex-flow: column reverse-wrap;']));
      // expect(atoms).deep.equal(atomRef);
    });
  });
}

function testReactiveAtoms() {

  // TODO: tests are incomplete and test strings are hard coded
  describe('reactive atoms', ()=> {

    const padTemplate = 'padding: $1 $2 $3 $4';
    const mrgVertTmplt = 'margin: $1 0';
    const fxfTmplt = 'flex-flow: $1 $2';

    it('should handle reactive modifiers correctly',()=>{
      // const atoms = {};
      // let atomRef = {};

      // const atomicFns = {};
      // atomicFns['p'] = makeAtomicFn(atoms, 'p', mapSpacingKeys, padTemplate);
      // atomicFns['mv'] = makeAtomicFn(atoms, 'mv', mapSpacingKeys, mrgVertTmplt);
      // atomicFns['fxf'] = makeAtomicFn(atoms, 'fxf', mapFlexKeys, fxfTmplt);
      // const { p, mv, fxf } = atomicFns;

      // TODO: need much better way to check against resulting cssStrings, esp RE @media strings, and breakpoints

      // let res;
      // res = rxSm(p(0));
      // expect(res).to.deep.equal([['p', 'sm:0', '@media (min-width: 576px) { padding: 0rem; };', atoms, ATOMIC_TUPLE_TAG]]);
      // atomRef = mergeDeepRight(atomRef, tupleToObj(['p', '0', 'padding: 0rem;']));
      // atomRef = mergeDeepRight(atomRef, tupleToObj(['p', 'sm:0', '@media (min-width: 576px) { padding: 0rem; };']));
      // expect(atoms).deep.equal(atomRef);

      // res = rxSm(fxf('row', 'wrap'), mv(32));
      // atomRef = mergeDeepRight(atomRef, tupleToObj(['fxf', 'row:wrap', 'flex-flow: row wrap;']));
      // atomRef = mergeDeepRight(atomRef, tupleToObj(['fxf', 'sm:row:wrap', '@media (min-width: 576px) { flex-flow: row wrap; };']));
      // atomRef = mergeDeepRight(atomRef, tupleToObj(['mv', '32', 'margin: 8rem 0;']));
      // atomRef = mergeDeepRight(atomRef, tupleToObj(['mv', 'sm:32', '@media (min-width: 576px) { margin: 8rem 0; };']));
      // expect(atoms).deep.equal(atomRef);
    });
  });
}

function testAtomicTransformer() {
  describe('atomic transformer', ()=> {

    const padTemplate = 'padding: $1 $2 $3 $4';
    const mTmplt = 'margin: $1 $2 $3 $4';
    const mrgVertTmplt = 'margin: $1 0';
    const fxfTmplt = 'flex-flow: $1 $2';

    it('should transform atomic input correctly',()=>{

      const atoms = {};
      //let atomRef = {};

      const atomicFns = {};
      atomicFns['p'] = makeAtomicFn(atoms, 'p', mapSpacingKeys, padTemplate);
      atomicFns['m'] = makeAtomicFn(atoms, 'm', mapSpacingKeys, mTmplt);
      atomicFns['mv'] = makeAtomicFn(atoms, 'mv', mapSpacingKeys, mrgVertTmplt);
      atomicFns['fxf'] = makeAtomicFn(atoms, 'fxf', mapFlexKeys, fxfTmplt);
      const { p, m, mv, fxf } = atomicFns;

      // const t1 = fcx(p(1), mv(1));

      // const t1 = fcx(p(1), fxf('row', 'nowrap'), rxSm(p(2), mv(8)));
      // const t2 = fcx( p(1), m(2), fxf('row', 'nowrap'),
      //                 rxSm(p(4), m(8), fxf('col', 'nowrap')));



      // console.log('t1: ', t1);
      // console.log('t2: ', t2);
      // console.log('atoms: ', atoms);



      // const t1 = fcx(p(1), rxSm(p(2)));

      // const t1 = fcx(p(1), p(2));
      // console.log('t1: ', t1);

      // const arr = [1, 2, 3];
      // arr.tag = 'tagme';

      // arr.map(i=>console.log('oioioi', i));
      // console.log('arr: ', arr);
      // const t2 = fcx(p(3), p(3));
      // console.log('t2: ', t2);

      // const t1 = p(3);
      // console.log('t1: ', t1);

      // const t2 = p(3);
      // console.log('t2: ', t2);


      // expect(addAtom(atoms, c2[TYPE], c2[SPEC], c2[CSS])).to.deep.equal(c2);
      // console.log('p(1): ', p(1));
      // expect(p(10(atoms, {}, mapSpacingKeys, mrgVertTmplt, [0])).to.equal('');
      // const t1 = fcx(p(1));
      // const t2 = fcx(p(2,3,4,5));
      // const t3 = fcx(mv(24), p(8,12));

      // console.log('t1: ', t1);
      // console.log('t2: ', t2);
      // console.log('t3: ', t3);
      // console.log('atoms: ', atoms);

      // const t4 = fcx(p(3), p(3));
      // console.log('t4: ', t4);
      // console.log('atoms: ', atoms);
      // const rx1 = rxSm(p(2), mv(32), p(5,6), fxf('row', 'nowrap'));
      // console.log('rx1: ', rx1);
      // console.log('atoms: ', atoms);

    });
  });
}

function testAtomFnMapping() {
  describe('atom function mapping', ()=> {
    it('should map atomic functions correctly',()=>{

      const atoms = {};
      const atomicFns = {};
      console.log('-----------------------------------------------');
      // mapAtomicFns(atoms, atomicFns, cssMap);
      console.log('atomicFns: ', atomicFns);
      console.log('-----------------------------------------------');

      const { ph, ml, mt, mb } = atomicFns;
      const res = fcx(ph(2), ml(8), rxSm(mt(3), mb(4)));
      console.log('res: ', res);
      console.log('atoms: ', atoms);
    });
  });
}
