import  {  expect } from 'chai';
import { mergeDeepRight } from 'ramda';
import { mapSpacingKeys } from '../../src/maps/spacing';
import { mapFlexKeys } from '../../src/maps/layout';
import { vectorToAtom } from '../../src/utils/testUtils';

import {
  ATOMIC_V_TAG,
  validAtomInput, getAtomCss, atomProp, atomExists, mapAtomicFns,
  getAtomicVector, addAtom, atom, makeAtomicFn, fcx, rxSm }
  from '../../src/utils/atomicUtils';

export default function runAtomicUtilTests() {
  describe('Atom util tests', ()=>{
    testAtomicUtils();
    testAtomInfoGet();
    testAtomInfoAdd();
    // testAtomRequests();
    // testAtomicFunctions();
    // testReactiveAtoms();
    // testAtomicTransformer();
    //testAtomFnMapping();
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

// function testAtomRequests() {
//   describe('atom requests', ()=> {

//     const pTmplt = 'padding: $1 $2 $3 $4';
//     const pbTmplt = 'padding-bottom: $1';
//     const mvTmplt = 'margin: $1 0';
//     const fxfTmplt = 'flex-flow: $1 $2';

//     it('should serve atom spacing requests correctly',()=>{

//       const atoms = {};
//       let atomRef = {};

//       // expect(atom(atoms, 'p', mapSpacingKeys, pTmplt, [1])).to.deep.equal(['p', '1', 'padding: 0.25rem;', atoms, ATOMIC_TUPLE_TAG]);
//       // atomRef = mergeDeepRight(atomRef, tupleToObj(['p', '1', 'padding: 0.25rem;']));
//       // expect(atoms).deep.equal(atomRef);

//       // expect(atom(atoms, 'p', mapSpacingKeys, pTmplt, [0, 4, 12, 24])).to.deep.equal(['p', '0:4:12:24', 'padding: 0rem 1rem 3rem 6rem;', atoms, ATOMIC_TUPLE_TAG]);
//       // atomRef = mergeDeepRight(atomRef, tupleToObj(['p', '0:4:12:24', 'padding: 0rem 1rem 3rem 6rem;']));
//       // expect(atoms).deep.equal(atomRef);

//       // expect(atom(atoms, 'pb', mapSpacingKeys, pbTmplt, [3])).to.deep.equal(['pb', '3', 'padding-bottom: 0.75rem;', atoms, ATOMIC_TUPLE_TAG]);
//       // atomRef = mergeDeepRight(atomRef, tupleToObj(['pb', '3', 'padding-bottom: 0.75rem;']));
//       // expect(atoms).deep.equal(atomRef);

//       // expect(atom(atoms, 'mv', mapSpacingKeys, mvTmplt, [0])).to.deep.equal(['mv', '0', 'margin: 0rem 0;', atoms, ATOMIC_TUPLE_TAG]);
//       // atomRef = mergeDeepRight(atomRef, tupleToObj(['mv', '0', 'margin: 0rem 0;']));
//       // expect(atoms).deep.equal(atomRef);

//       // expect(atom(atoms, 'mv', mapSpacingKeys, mvTmplt, [32])).to.deep.equal(['mv', '32', 'margin: 8rem 0;', atoms, ATOMIC_TUPLE_TAG]);
//       // atomRef = mergeDeepRight(atomRef, tupleToObj(['mv', '32', 'margin: 8rem 0;']));
//       // expect(atoms).deep.equal(atomRef);

//       // expect(atom(atoms, 'fxf', mapFlexKeys, fxfTmplt, ['row', 'nowrap'])).to.deep.equal(['fxf', 'row:nowrap', 'flex-flow: row nowrap;', atoms, ATOMIC_TUPLE_TAG]);
//       // atomRef = mergeDeepRight(atomRef, tupleToObj(['fxf', 'row:nowrap', 'flex-flow: row nowrap;']));
//       // expect(atoms).deep.equal(atomRef);

//     });

//     it('should handle invalid atom spacing requests correctly',()=>{

//       // const atoms = {};

//       // These pass should fail
//       // expect(atom(atoms, {}, mapSpacingKeys, mvTmplt, [0])).to.equal('');
//       // expect(atom(atoms, 'pb', mapSpacingKeys, {}, [3])).to.equal('');
//       // expect(atoms).deep.equal(atomRef);
//       // expect(atom(atoms, 'pb', mapSpacingKeys, pb, 3)).to.equal('');
//       // expect(atom(atoms, 'mv', 'mv', mv, [0])).to.equal('margin: 0rem 0;');
//       // console.log(atoms);
//     });
//   });
// }

// function testAtomicFunctions() {
//   describe('atomic functions', ()=> {

//     const pTmplt = 'padding: $1 $2 $3 $4';
//     const mvTmplt = 'margin: $1 0';
//     const fxfTmplt = 'flex-flow: $1 $2';

//     it('should create atomic functions correctly',()=>{
//       const atoms = {};
//       let atomRef = {};

//       const atomicFns = {};
//       atomicFns['p'] = makeAtomicFn(atoms, 'p', mapSpacingKeys, pTmplt);
//       atomicFns['mv'] = makeAtomicFn(atoms, 'mv', mapSpacingKeys, mvTmplt);
//       atomicFns['fxf'] = makeAtomicFn(atoms, 'fxf', mapFlexKeys, fxfTmplt);
//       const { p, mv, fxf } = atomicFns;

//       // expect(p(0)).to.deep.equal(['p', '0', 'padding: 0rem;', atoms, ATOMIC_TUPLE_TAG ]);
//       // atomRef = mergeDeepRight(atomRef, tupleToObj(['p', '0', 'padding: 0rem;']));
//       // expect(atoms).deep.equal(atomRef);

//       // expect(p(5,6,8,10)).to.deep.equal(['p', '5:6:8:10', 'padding: 1.25rem 1.5rem 2rem 2.5rem;', atoms, ATOMIC_TUPLE_TAG ]);
//       // atomRef = mergeDeepRight(atomRef, tupleToObj(['p', '5:6:8:10', 'padding: 1.25rem 1.5rem 2rem 2.5rem;']));
//       // expect(atoms).deep.equal(atomRef);

//       // expect(mv(20)).to.deep.equal(['mv', '20', 'margin: 5rem 0;', atoms, ATOMIC_TUPLE_TAG ]);
//       // atomRef = mergeDeepRight(atomRef, tupleToObj(['mv', '20', 'margin: 5rem 0;']));
//       // expect(atoms).deep.equal(atomRef);

//       // expect(fxf('row', 'wrap')).to.deep.equal(['fxf', 'row:wrap', 'flex-flow: row wrap;', atoms, ATOMIC_TUPLE_TAG ]);
//       // atomRef = mergeDeepRight(atomRef, tupleToObj(['fxf', 'row:wrap', 'flex-flow: row wrap;']));
//       // expect(atoms).deep.equal(atomRef);

//       // expect(fxf('col', 'rwrap')).to.deep.equal(['fxf', 'col:rwrap', 'flex-flow: column reverse-wrap;', atoms, ATOMIC_TUPLE_TAG ]);
//       // atomRef = mergeDeepRight(atomRef, tupleToObj(['fxf', 'col:rwrap', 'flex-flow: column reverse-wrap;']));
//       // expect(atoms).deep.equal(atomRef);
//     });
//   });
// }

// function testReactiveAtoms() {

//   // TODO: tests are incomplete and test strings are hard coded
//   describe('reactive atoms', ()=> {

//     const pTmplt = 'padding: $1 $2 $3 $4';
//     const mvTmplt = 'margin: $1 0';
//     const fxfTmplt = 'flex-flow: $1 $2';

//     it('should handle reactive modifiers correctly',()=>{
//       // const atoms = {};
//       // let atomRef = {};

//       // const atomicFns = {};
//       // atomicFns['p'] = makeAtomicFn(atoms, 'p', mapSpacingKeys, pTmplt);
//       // atomicFns['mv'] = makeAtomicFn(atoms, 'mv', mapSpacingKeys, mvTmplt);
//       // atomicFns['fxf'] = makeAtomicFn(atoms, 'fxf', mapFlexKeys, fxfTmplt);
//       // const { p, mv, fxf } = atomicFns;

//       // TODO: need much better way to check against resulting cssStrings, esp RE @media strings, and breakpoints

//       // let res;
//       // res = rxSm(p(0));
//       // expect(res).to.deep.equal([['p', 'sm:0', '@media (min-width: 576px) { padding: 0rem; };', atoms, ATOMIC_TUPLE_TAG]]);
//       // atomRef = mergeDeepRight(atomRef, tupleToObj(['p', '0', 'padding: 0rem;']));
//       // atomRef = mergeDeepRight(atomRef, tupleToObj(['p', 'sm:0', '@media (min-width: 576px) { padding: 0rem; };']));
//       // expect(atoms).deep.equal(atomRef);

//       // res = rxSm(fxf('row', 'wrap'), mv(32));
//       // atomRef = mergeDeepRight(atomRef, tupleToObj(['fxf', 'row:wrap', 'flex-flow: row wrap;']));
//       // atomRef = mergeDeepRight(atomRef, tupleToObj(['fxf', 'sm:row:wrap', '@media (min-width: 576px) { flex-flow: row wrap; };']));
//       // atomRef = mergeDeepRight(atomRef, tupleToObj(['mv', '32', 'margin: 8rem 0;']));
//       // atomRef = mergeDeepRight(atomRef, tupleToObj(['mv', 'sm:32', '@media (min-width: 576px) { margin: 8rem 0; };']));
//       // expect(atoms).deep.equal(atomRef);
//     });
//   });
// }

// function testAtomicTransformer() {
//   describe('atomic transformer', ()=> {

//     const pTmplt = 'padding: $1 $2 $3 $4';
//     const mTmplt = 'margin: $1 $2 $3 $4';
//     const mvTmplt = 'margin: $1 0';
//     const fxfTmplt = 'flex-flow: $1 $2';

//     it('should transform atomic input correctly',()=>{

//       const atoms = {};
//       //let atomRef = {};

//       const atomicFns = {};
//       atomicFns['p'] = makeAtomicFn(atoms, 'p', mapSpacingKeys, pTmplt);
//       atomicFns['m'] = makeAtomicFn(atoms, 'm', mapSpacingKeys, mTmplt);
//       atomicFns['mv'] = makeAtomicFn(atoms, 'mv', mapSpacingKeys, mvTmplt);
//       atomicFns['fxf'] = makeAtomicFn(atoms, 'fxf', mapFlexKeys, fxfTmplt);
//       const { p, m, mv, fxf } = atomicFns;

//       // const t1 = fcx(p(1), mv(1));

//       // const t1 = fcx(p(1), fxf('row', 'nowrap'), rxSm(p(2), mv(8)));
//       // const t2 = fcx( p(1), m(2), fxf('row', 'nowrap'),
//       //                 rxSm(p(4), m(8), fxf('col', 'nowrap')));



//       // console.log('t1: ', t1);
//       // console.log('t2: ', t2);
//       // console.log('atoms: ', atoms);



//       // const t1 = fcx(p(1), rxSm(p(2)));

//       // const t1 = fcx(p(1), p(2));
//       // console.log('t1: ', t1);

//       // const arr = [1, 2, 3];
//       // arr.tag = 'tagme';

//       // arr.map(i=>console.log('oioioi', i));
//       // console.log('arr: ', arr);
//       // const t2 = fcx(p(3), p(3));
//       // console.log('t2: ', t2);

//       // const t1 = p(3);
//       // console.log('t1: ', t1);

//       // const t2 = p(3);
//       // console.log('t2: ', t2);


//       // expect(addAtom(atoms, c2[TYPE], c2[SPEC], c2[CSS])).to.deep.equal(c2);
//       // console.log('p(1): ', p(1));
//       // expect(p(10(atoms, {}, mapSpacingKeys, mvTmplt, [0])).to.equal('');
//       // const t1 = fcx(p(1));
//       // const t2 = fcx(p(2,3,4,5));
//       // const t3 = fcx(mv(24), p(8,12));

//       // console.log('t1: ', t1);
//       // console.log('t2: ', t2);
//       // console.log('t3: ', t3);
//       // console.log('atoms: ', atoms);

//       // const t4 = fcx(p(3), p(3));
//       // console.log('t4: ', t4);
//       // console.log('atoms: ', atoms);
//       // const rx1 = rxSm(p(2), mv(32), p(5,6), fxf('row', 'nowrap'));
//       // console.log('rx1: ', rx1);
//       // console.log('atoms: ', atoms);

//     });
//   });
// }

// function testAtomFnMapping() {
//   describe('atom function mapping', ()=> {
//     it('should map atomic functions correctly',()=>{

//       const atoms = {};
//       const atomicFns = {};
//       console.log('-----------------------------------------------');
//       mapAtomicFns(atoms, atomicFns, cssMap);
//       console.log('atomicFns: ', atomicFns);
//       console.log('-----------------------------------------------');

//       const { ph, ml, mt, mb } = atomicFns;
//       const res = fcx(ph(2), ml(8), rxSm(mt(3), mb(4)));
//       console.log('res: ', res);
//       console.log('atoms: ', atoms);
//     });
//   });
// }
