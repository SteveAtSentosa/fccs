import  {  expect } from 'chai';
import { mergeDeepRight } from 'ramda';
import { vectorToAtom } from '../../src/utils/testUtils';

import {
  ATOMIC_V_TAG,
  validAtomInput, getAtomCss, atomProp, atomExists, mapAtomicFns,
  getAtomicVector, addAtom, atom, makeAtomicFn, fcx }
  from '../../src/utils/atomicUtils';

export default function runAtomicUtilTests() {
  describe('Atom util tests', ()=>{
    testAtomicUtils();
    testAtomInfoGet();
    testAtomInfoAdd();
  });
}

const testAtomsGet = {
  c : {
    'red:100': '#rrr100',
    'red:200': '#rrr200',
    'grey': 'gggggg',
    'hover:red:200': '&:hover { color: #rrr200; }`'
  },
  p : {
    '1': '1rem',
    '2': '2rem',
    '3': '3rem',
    'sm:3': '@media (min-width: 576px) { font-size: 100%; }'
  },
};

function testAtomicUtils() {
  describe('atom utils', ()=> {
    it('should run atom util fxns correctly',()=>{

      expect(validAtomInput(testAtomsGet, 'c', 'red:100')).to.equal(true);
      expect(validAtomInput(testAtomsGet, 'p', 2)).to.equal(true);
      expect(validAtomInput({}, 'xyz', '')).to.equal(false);
      expect(validAtomInput({}, '', 'xyz')).to.equal(false);
      expect(validAtomInput([], 'c', 'red:100')).to.equal(false);
      expect(validAtomInput(testAtomsGet, {}, 'red:100')).to.equal(false);
      expect(validAtomInput(testAtomsGet, 'c', ['red:100'])).to.equal(false);

      expect(atomProp(testAtomsGet, 'c', 'red:100')).to.equal('#rrr100');
      expect(atomProp(testAtomsGet, 'p', '2')).to.equal('2rem');
      expect(atomProp(testAtomsGet, 'p', 3)).to.equal('3rem');
      expect(atomProp(testAtomsGet, 'p', 99)).to.equal(undefined);
      expect(atomProp(testAtomsGet, 'c', 'not there')).to.equal(undefined);

      expect(atomExists(testAtomsGet, 'c', 'red:100')).to.equal(true);
      expect(atomExists(testAtomsGet, 'p', 1)).to.equal(true);
      expect(atomExists(testAtomsGet, 'p', '2')).to.equal(true);
      expect(atomExists(testAtomsGet, 'p', 'sm:3')).to.equal(true);
      expect(atomExists(testAtomsGet, 'x', '2')).to.equal(false);
      expect(atomExists([], 'c', 'red:100')).to.equal(false);
      expect(atomExists(testAtomsGet, 'c', 'not there')).to.equal(false);
      expect(atomExists(undefined, 'c', 'red:100')).to.equal(false);
      expect(atomExists(testAtomsGet, undefined, 'red:100')).to.equal(false);
      expect(atomExists(testAtomsGet, 'c', undefined)).to.equal(false);
      expect(atomExists()).to.equal(false);
    });

  });
}

function testAtomInfoGet() {
  describe('type utils', ()=> {
    it('should get atom cssStr correctly',()=>{

      expect(getAtomCss(testAtomsGet, 'c', 'red:100')).to.equal(testAtomsGet['c']['red:100']);
      expect(getAtomCss(testAtomsGet, 'c', 'red:200')).to.equal(testAtomsGet['c']['red:200']);
      expect(getAtomCss(testAtomsGet, 'p', 2)).to.equal(testAtomsGet['p']['2']);
      expect(getAtomCss(testAtomsGet, 'p', '3')).to.equal(testAtomsGet['p']['3']);
      expect(getAtomCss(testAtomsGet, 'p', 'sm:3')).to.equal(testAtomsGet['p']['sm:3']);
      expect(getAtomCss({}, 'c', 'red:200')).to.equal('');
      expect(getAtomCss(testAtomsGet, 'c', ['red:200'])).to.equal('');
      expect(getAtomCss(testAtomsGet, 2, 'p')).to.equal('');
      expect(getAtomCss(testAtomsGet, 'c', 'red:400')).to.equal('');
    });

    it('should get atom vectors correctly',()=>{

      // construct atomic vector against get test data
      const aVecGet = (type, spec) =>
        ({ type, spec, css: testAtomsGet[type][spec], atoms: testAtomsGet, tag: ATOMIC_V_TAG });

      expect(getAtomicVector(testAtomsGet, 'c', 'red:100')).to.deep.equal(aVecGet('c', 'red:100'));
      expect(getAtomicVector(testAtomsGet, 'c', 'red:200')).to.deep.equal(aVecGet('c', 'red:200'));
      expect(getAtomicVector(testAtomsGet, 'p', 2)).to.deep.equal(aVecGet('p', 2));
      expect(getAtomicVector(testAtomsGet, 'p', '3')).to.deep.equal(aVecGet('p', '3'));
      expect(getAtomicVector(testAtomsGet, 'c', 'hover:red:200')).to.deep.equal(aVecGet('c', 'hover:red:200'));
      expect(getAtomicVector({}, 'c', 'red:200')).deep.to.equal(undefined);
      expect(getAtomicVector(testAtomsGet, 'c', ['red:200'])).to.deep.equal(undefined);
      expect(getAtomicVector(testAtomsGet, 2, 'p')).to.deep.equal(undefined);
      expect(getAtomicVector(testAtomsGet, 'c', 'red:400')).to.deep.equal(undefined);
    });
  });
}

function testAtomInfoAdd() {

  describe('Atom info add', ()=> {
    it('should add atoms correctly',()=>{
      const atoms = {};
      let atomRef = {};

      const aVec = (type, spec, css) =>
        ({ atoms, type, spec, css, tag: ATOMIC_V_TAG });

      const cv1 = aVec('c', 'red:100', '#rrr100');
      const cv2 = aVec('c', 'red:200', '#rrr200');
      const cv3 = aVec('c', 'grey', 'gggggg');
      const pv1 = aVec('p', '1', '1rem');
      const pv2 = aVec('p', '2', '2rem');
      const pv3 = aVec('p', '3', '3rem');

      expect(addAtom(atoms, cv1.type, cv1.spec, cv1.css)).to.deep.equal(cv1);
      atomRef = mergeDeepRight(atomRef, vectorToAtom(cv1));
      expect(atoms).deep.equal(atomRef);

      expect(addAtom(atoms, cv2.type, cv2.spec, cv2.css)).to.deep.equal(cv2);
      atomRef = mergeDeepRight(atomRef, vectorToAtom(cv2));
      expect(atoms).deep.equal(atomRef);

      expect(addAtom(atoms, pv1.type, pv1.spec, pv1.css)).to.deep.equal(pv1);
      atomRef = mergeDeepRight(atomRef, vectorToAtom(pv1));
      expect(atoms).deep.equal(atomRef);

      expect(addAtom(atoms, pv3.type, pv3.spec, pv3.css)).to.deep.equal(pv3);
      atomRef = mergeDeepRight(atomRef, vectorToAtom(pv3));
      expect(atoms).deep.equal(atomRef);

      expect(addAtom(atoms, cv3.type, cv3.spec, cv3.css)).to.deep.equal(cv3);
      expect(addAtom(atoms, cv3.type, cv3.spec, cv3.css)).to.deep.equal(cv3);
      atomRef = mergeDeepRight(atomRef, vectorToAtom(cv3));
      expect(atoms).deep.equal(atomRef);

      expect(addAtom(atoms, pv2.type, pv2.spec, pv2.css)).to.deep.equal(pv2);
      atomRef = mergeDeepRight(atomRef, vectorToAtom(pv2));
      expect(atoms).deep.equal(atomRef);

      expect(addAtom([atoms], pv2.type, pv2.spec, pv2.css)).to.deep.equal(undefined);
      expect(atoms).deep.equal(atomRef);

      expect(addAtom(atoms, undefined, pv2.spec, pv2.css)).to.deep.equal(undefined);
      expect(atoms).deep.equal(atomRef);

      expect(addAtom(atoms, {a:'b'}, 'a', 'b')).to.deep.equal(undefined);
      expect(atoms).deep.equal(atomRef);

      expect(addAtom(atoms, pv3.type, pv3.spec, ['abc'])).to.deep.equal(undefined);
      expect(atoms).deep.equal(atomRef);

      expect(addAtom(atoms, pv2.type, pv2.spec, pv2.css)).to.deep.equal(pv2);
      atomRef = mergeDeepRight(atomRef, vectorToAtom(pv2));
      expect(atoms).deep.equal(atomRef);
    });
  });
}

