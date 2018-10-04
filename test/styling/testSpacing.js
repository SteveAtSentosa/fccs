import  {  expect } from 'chai';
import { mergeDeepRight } from 'ramda';
import { mapSpacingKeys, spacingKeyMap, spacingAtomicMap } from '../../src/maps/spacing';
import { vectorToAtom, makeTestSpec, randomCssKeyList } from '../../src/utils/testUtils';
import { ATOMIC_V_TAG, atom } from '../../src/utils/atomicUtils';

export default function runSpacingTests() {
  describe('Atomoic request tests', ()=>{
    testSpaceMapping();
    testSpacingRequests();
  });
}

//*************************************************************************************************
function testSpaceMapping() {
//*************************************************************************************************

  describe('space mapping', ()=> {
    it('should map valid spacing specs properly',()=>{
      expect(mapSpacingKeys([0])).to.deep.equal(['0rem']);
      expect(mapSpacingKeys(['3'])).to.deep.equal(['0.75rem']);
      expect(mapSpacingKeys([8])).to.deep.equal(['2rem']);
      expect(mapSpacingKeys(['10'])).to.deep.equal(['2.5rem']);
      expect(mapSpacingKeys([32])).to.deep.equal(['8rem']);
      expect(mapSpacingKeys([0,32])).to.deep.equal(['0rem', '8rem']);
      expect(mapSpacingKeys([1,2,'3','4'])).to.deep.equal(['0.25rem', '0.5rem', '0.75rem', '1rem']);
    });
    it('should map invalid spacing specs to empty string',()=>{
      expect(mapSpacingKeys([33])).to.deep.equal(['']);
      expect(mapSpacingKeys([''])).to.deep.equal(['']);
      expect(mapSpacingKeys([{8:8}])).to.deep.equal(['']);
      expect(mapSpacingKeys([[8]])).to.deep.equal(['']);
      expect(mapSpacingKeys(['abc'])).to.deep.equal(['']);
      expect(mapSpacingKeys(['abc', 33, undefined, {}, []])).to.deep.equal(['','','','','']);
      expect(mapSpacingKeys()).to.deep.equal([]);
      expect(mapSpacingKeys({8:8})).to.deep.equal([]);
    });
  });
}

//*************************************************************************************************
function testSpacingRequests() {
//*************************************************************************************************

  describe('atomic spacing requests', ()=> {

    it('should serve atom spacing requests correctly',() => {

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

      expectVec = { type: 'p', spec: '2', css: 'padding: 0.5rem;', atoms, tag: ATOMIC_V_TAG};
      expect(atom(atoms, 'p', mapSpacingKeys, padTemplate, 2)).to.deep.equal(expectVec);
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


      // Tests that rely on some utils that are also used by code under test.
      // This is so that we carry out extensive data driven testing

      const makeSpacingTest = (cssProp, cssKeys) => makeTestSpec(atoms, spacingKeyMap, spacingAtomicMap, cssProp, cssKeys);
      const randomSpackingKeyList = cssProp => randomCssKeyList(spacingKeyMap, spacingAtomicMap, cssProp);

      // Run tests for all spacing atomic calls.
      // Loop over the test set because random number of css keys are used each test run, and we want to hit lots of different combinations
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
      const atoms = {};
      const mrgVertTmplt = 'margin: $1 0';
      expect(atom('atoms', 'mv', mapSpacingKeys, mrgVertTmplt, ['0'])).to.deep.equal(undefined);
      expect(atom(atoms, ['mv'], mapSpacingKeys, mrgVertTmplt, ['0'])).to.deep.equal(undefined);
      expect(atom(atoms, 'mv', 'mapSpacingKeys', mrgVertTmplt, ['0'])).to.deep.equal(undefined);
      expect(atom(atoms, 'mv', mapSpacingKeys, {}, ['0'])).to.deep.equal(undefined);
      expect(atom(atoms, 'mv', mapSpacingKeys, mrgVertTmplt, {0:0})).to.deep.equal(undefined);
      expect(atoms).deep.equal({});

    });
  });
}

