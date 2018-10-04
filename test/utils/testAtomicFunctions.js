import  {  expect } from 'chai';
import { mergeDeepRight } from 'ramda';
import { vectorToAtom } from '../../src/utils/testUtils';
import { ATOMIC_V_TAG, makeAtomicFn, mapAtomicFns, fcx  } from '../../src/utils/atomicUtils';

import { mapSpacingKeys, spacingAtomicMap } from '../../src/maps/spacing';
import { mapColorKeys } from '../../src/maps/color';
import { mapDisplayKeys } from '../../src/maps/layout';

export default function runAtomicFunctionTests() {
  describe('Atomoic request tests', ()=>{
    testAtomicFunctions();
    testAtomicTransformer();
    testAtomicFunctionAdd();
  });
}

const padTemplate = 'padding: $1 $2 $3 $4';
const mrgVertTemplate = 'margin: $1 0';
const displayTemplate = 'display: $1';
const colorTemplate = 'color: $1';

function testAtomicFunctions() {
  describe('atomic functions', ()=> {

    // Just some simple testing to verify atomic functions are correctly constructed

    it('should create atomic functions correctly',()=>{
      const atoms = {};
      let atomRef = {};

      const atomicFns = {};
      atomicFns['p'] = makeAtomicFn(atoms, 'p', mapSpacingKeys, padTemplate);
      atomicFns['mv'] = makeAtomicFn(atoms, 'mv', mapSpacingKeys, mrgVertTemplate);
      atomicFns['d'] = makeAtomicFn(atoms, 'd', mapDisplayKeys, displayTemplate);
      atomicFns['c'] = makeAtomicFn(atoms, 'c', mapColorKeys, colorTemplate);

      let expectVec = {};
      const { p, mv, d, c } = atomicFns;

      expectVec = { type: 'p', spec: '0', css: 'padding: 0rem;', atoms, tag: ATOMIC_V_TAG};
      expect(p(0)).to.deep.equal(expectVec);
      atomRef = mergeDeepRight(atomRef, vectorToAtom(expectVec));
      expect(atoms).deep.equal(atomRef);

      expectVec = { type: 'p', spec: '5:6:8:10', css: 'padding: 1.25rem 1.5rem 2rem 2.5rem;', atoms, tag: ATOMIC_V_TAG};
      expect(p(5,6,8,10)).to.deep.equal(expectVec);
      atomRef = mergeDeepRight(atomRef, vectorToAtom(expectVec));
      expect(atoms).deep.equal(atomRef);

      expectVec = { type: 'mv', spec: '20', css: 'margin: 5rem 0;', atoms, tag: ATOMIC_V_TAG};
      expect(mv(20)).to.deep.equal(expectVec);
      atomRef = mergeDeepRight(atomRef, vectorToAtom(expectVec));
      expect(atoms).deep.equal(atomRef);

      expectVec = { type: 'd', spec: 'fx', css: 'display: flex;', atoms, tag: ATOMIC_V_TAG};
      expect(d('fx')).to.deep.equal(expectVec);
      atomRef = mergeDeepRight(atomRef, vectorToAtom(expectVec));
      expect(atoms).deep.equal(atomRef);

      expectVec = { type: 'c', spec: 'grey:300', css: 'color: #e0e0e0;', atoms, tag: ATOMIC_V_TAG};
      expect(c('grey:300')).to.deep.equal(expectVec);
      atomRef = mergeDeepRight(atomRef, vectorToAtom(expectVec));
      expect(atoms).deep.equal(atomRef);
    });
  });
}

function testAtomicTransformer() {
  describe('atomic transformer', ()=> {

    const padTemplate = 'padding: $1 $2 $3 $4';
    const mrgVertTemplate = 'margin: $1 0';
    const displayTemplate = 'display: $1';
    const colorTemplate = 'color: $1';

    it('should transform atomic output correctly',()=>{
      const atoms = {};

      const atomicFns = {};
      atomicFns['p'] = makeAtomicFn(atoms, 'p', mapSpacingKeys, padTemplate);
      atomicFns['mv'] = makeAtomicFn(atoms, 'mv', mapSpacingKeys, mrgVertTemplate);
      atomicFns['d'] = makeAtomicFn(atoms, 'd', mapDisplayKeys, displayTemplate);
      atomicFns['c'] = makeAtomicFn(atoms, 'c', mapColorKeys, colorTemplate);

      let expectArr = [];
      const { p, mv, d, c } = atomicFns;

      expectArr = ['padding: 0.25rem;', 'padding: 0.5rem;'];
      expect(fcx(p(1), p(2))).to.deep.equal(expectArr);

      expectArr = ['display: inline;'];
      expect(fcx(d('i'))).to.deep.equal(expectArr);

      expectArr = ['padding: 0rem;', 'margin: 2rem 0;', 'display: inline-block;', 'color: #22292f;'];
      expect(fcx(p(0), mv(8), d('ib'), c('black'))).to.deep.equal(expectArr);
    });
  });
}

function testAtomicFunctionAdd() {
  describe('atomic function create', ()=> {

    it('should add atomic functions correctly',()=>{

      let atoms = {};
      const atomicFns =  mapAtomicFns(atoms, spacingAtomicMap);

      let expectArr = [];
      const { p, mv } = atomicFns;

      expectArr = ['padding: 0.25rem;', 'padding: 0.5rem;'];
      expect(fcx(p(1), p(2))).to.deep.equal(expectArr);

      expectArr = ['padding: 0rem;', 'margin: 2rem 0;'];
      expect(fcx(p(0), mv(8))).to.deep.equal(expectArr);
    });
  });
}

