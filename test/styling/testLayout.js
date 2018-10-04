import  {  expect } from 'chai';
import { mergeDeepRight, flatten, pick, clone } from 'ramda';
import { makeTestSpec, vectorToAtom } from '../../src/utils/testUtils';
import { mapDisplayKeys, displayKeyMap, displayAtomicMap, flexKeyMap, flexAtomicMap  } from '../../src/maps/layout';
import { mapAtomicFns, fcx } from '../../src/utils/atomicUtils';

export default function runLayoutTests() {
  describe('Atomoic request tests', ()=>{
    testDisplayAtoms();
    testFlexAtoms();
  });
}


//*************************************************************************************************
function testDisplayAtoms() {
//*************************************************************************************************

  describe('display requests', ()=> {

    it('should map display keys correctly',()=>{
      expect(mapDisplayKeys('b')).to.deep.equal(['block']);
      expect(mapDisplayKeys('ib')).to.deep.equal(['inline-block']);
      expect(mapDisplayKeys('i')).to.deep.equal(['inline']);
      expect(mapDisplayKeys('t')).to.deep.equal(['table']);
      expect(mapDisplayKeys('tr')).to.deep.equal(['table-row']);
      expect(mapDisplayKeys('tr')).to.deep.equal(['table-row']);
      expect(mapDisplayKeys('h')).to.deep.equal(['hidden']);
      expect(mapDisplayKeys('ifx')).to.deep.equal(['inline-flex']);
    });
    it('should handle invalid color mapping input correctly',()=>{
      expect(mapDisplayKeys('')).to.deep.equal(['']);
      expect(mapDisplayKeys({})).to.deep.equal([]);
    });

    it('should handle display atoms functions correctly',()=>{

      let atoms = {};
      let atomRef = {};
      const displayFns = mapAtomicFns(atoms, displayAtomicMap);

      const makeDisplayTest = (cssProp, displayKey) => makeTestSpec(atoms, displayKeyMap, displayAtomicMap, cssProp, displayKey);

      // one at a time

      const tests = flatten(Object.keys(displayAtomicMap).map(cssProp =>
        Object.keys(displayKeyMap.vals).map(cssKey=>makeDisplayTest(cssProp, cssKey))));

      tests.map(t=> {
        expect(displayFns[t.fn](...t.cssKeys)).to.deep.equal(t.expectVector);
        atomRef = mergeDeepRight(atomRef, vectorToAtom(t.expectVector));
        expect(atoms).deep.equal(atomRef);
      });

      // all at once
      const layoutVectors = tests.map(t=>displayFns[t.fn](...t.cssKeys));
      const expectedCssList = tests.map(t=>t.expectCss);
      expect(fcx(...layoutVectors)).to.deep.equal(expectedCssList);

    });

    it('should handle invalid display requests correctly',()=>{
      // TODO: NYI
    });
  });
}

//*************************************************************************************************
function testFlexAtoms() {
//*************************************************************************************************

  describe('flex requests', ()=> {

    it('should handle flex atoms functions correctly',()=>{

      let atoms = {};

      const flexFns = mapAtomicFns(atoms, flexAtomicMap);
      const makeFlexTest = (cssProp, flexKeys) => makeTestSpec(atoms, flexKeyMap, flexAtomicMap, cssProp, flexKeys);

      // lets make sure the non mapping functions are working correctly
      const { ord, fxg, fxs, fxb, fx, fxf } = flexFns;
      expect(fcx(ord(99))).to.deep.equal(['order: 99;']);
      expect(fcx(ord(-1))).to.deep.equal(['order: -1;']);
      expect(fcx(fxg(22))).to.deep.equal(['flex-grow: 22;']);
      expect(fcx(fxs('0'))).to.deep.equal(['flex-shrink: 0;']);
      expect(fcx(fxb(44))).to.deep.equal(['flex-basis: 44;']);
      expect(fcx(fxb('auto'))).to.deep.equal(['flex-basis: auto;']);
      expect(fcx(fx(11, '20%', 'auto'))).to.deep.equal(['flex: 11 20% auto;']);
      expect(fcx(fxf('col', 'nowrap'))).to.deep.equal(['flex-flow: column nowrap;']);

      // OK, test all combinations of mapping atoms

      let atomRef = clone(atoms);

      // TODO: need a better way to know if tests are mapped or not mapped, and construct test accordingly (perhaps flag in atomicMap)
      const partialAtomicMap = pick(['flexDirection', 'flexWrap', 'alignItems', 'justifyContent', 'alignContent', 'alignSelf' ], flexAtomicMap);
      const tests = flatten(Object.keys(partialAtomicMap).map(cssProp =>
        Object.keys(flexKeyMap.vals).map(cssKey=>makeFlexTest(cssProp, cssKey))));

      tests.map(t=> {
        expect(flexFns[t.fn](...t.cssKeys)).to.deep.equal(t.expectVector);
        atomRef = mergeDeepRight(atomRef, vectorToAtom(t.expectVector));
        expect(atoms).deep.equal(atomRef);
      });

      // all at once
      const layoutVectors = tests.map(t=>flexFns[t.fn](...t.cssKeys));
      const expectedCssList = tests.map(t=>t.expectCss);
      expect(fcx(...layoutVectors)).to.deep.equal(expectedCssList);
    });


    it('should handle invalid display requests correctly',()=>{
      // TODO: NYI
    });
  });
}

