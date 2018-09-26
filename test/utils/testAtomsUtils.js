import  {  expect } from 'chai';
import { mergeDeepRight } from 'ramda';
import { css } from 'emotion';
import { tupleToObj } from '../../src/utils/typeUtils';
import { mapSpacingKeys } from '../../src/maps/spacing';
import { mapFlexKeys } from '../../src/maps/flex';
import { cssMap } from '../../src/maps/css';

import {
  TYPE, SPEC, CSS, ATOMIC_TUPLE_TAG, RX_TAG,
  validAtomInput, getAtomCss, atomProp, atomExists, mapAtomicFns,
  getAtomTuple, addAtom, atom, makeAtomicFn, fcx, rxSm }
  from '../../src/utils/atomUtils';

export default function runAtomUtilTests() {
  describe('Atom util tests', ()=>{
    testAtomUtils();
    testAtomInfoGet();
    testAtomInfoAdd();
    testAtomRequests();
    testAtomicFunctions();
    testReactiveAtoms();
    testAtomicTransformer();
    //testAtomFnMapping();
  });
}

const testAtoms = {
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

function testAtomUtils() {
  describe('atom utils', ()=> {
    it('should run atom util fxns correctly',()=>{

      expect(validAtomInput(testAtoms, 'c', 'red:100')).to.equal(true);
      expect(validAtomInput(testAtoms, 'p', 2)).to.equal(true);
      expect(validAtomInput([], 'c', 'red:100')).to.equal(false);
      expect(validAtomInput(testAtoms, {}, 'red:100')).to.equal(false);
      expect(validAtomInput(testAtoms, 'c', ['red:100'])).to.equal(false);

      expect(atomProp(testAtoms, 'c', 'red:100')).to.equal('#rrr100');
      expect(atomProp(testAtoms, 'p', '2')).to.equal('2rem');
      expect(atomProp(testAtoms, 'p', 3)).to.equal('3rem');
      expect(atomProp(testAtoms, 'p', 99)).to.equal(undefined);
      expect(atomProp(testAtoms, 'c', 'not there')).to.equal(undefined);

      expect(atomExists(testAtoms, 'c', 'red:100')).to.equal(true);
      expect(atomExists(testAtoms, 'p', 1)).to.equal(true);
      expect(atomExists(testAtoms, 'p', '2')).to.equal(true);
      expect(atomExists(testAtoms, 'p', 'sm:3')).to.equal(true);
      expect(atomExists(testAtoms, 'x', '2')).to.equal(false);
      expect(atomExists([], 'c', 'red:100')).to.equal(false);
      expect(atomExists(testAtoms, 'c', 'not there')).to.equal(false);
      expect(atomExists(undefined, 'c', 'red:100')).to.equal(false);
      expect(atomExists(testAtoms, undefined, 'red:100')).to.equal(false);
      expect(atomExists(testAtoms, 'c', undefined)).to.equal(false);
      expect(atomExists()).to.equal(false);
    });

  });
}

function testAtomInfoGet() {
  describe('type utils', ()=> {
    it('should get atom cssStr correctly',()=>{

      expect(getAtomCss(testAtoms, 'c', 'red:100')).to.equal(testAtoms['c']['red:100']);
      expect(getAtomCss(testAtoms, 'c', 'red:200')).to.equal(testAtoms['c']['red:200']);
      expect(getAtomCss(testAtoms, 'p', 2)).to.equal(testAtoms['p']['2']);
      expect(getAtomCss(testAtoms, 'p', '3')).to.equal(testAtoms['p']['3']);
      expect(getAtomCss(testAtoms, 'p', 'sm:3')).to.equal(testAtoms['p']['sm:3']);
      expect(getAtomCss({}, 'c', 'red:200')).to.equal('');
      expect(getAtomCss(testAtoms, 'c', ['red:200'])).to.equal('');
      expect(getAtomCss(testAtoms, 2, 'p')).to.equal('');
      expect(getAtomCss(testAtoms, 'c', 'red:400')).to.equal('');
    });
    it('should get atom tuples correctly',()=>{
      expect(getAtomTuple(testAtoms, 'c', 'red:100')).to.deep.equal(['c', 'red:100', testAtoms['c']['red:100'], testAtoms, ATOMIC_TUPLE_TAG ]);
      expect(getAtomTuple(testAtoms, 'c', 'red:200')).to.deep.equal(['c', 'red:200', testAtoms['c']['red:200'], testAtoms, ATOMIC_TUPLE_TAG ]);
      expect(getAtomTuple(testAtoms, 'p', 2)).to.deep.equal(['p', '2', testAtoms['p']['2'], testAtoms, ATOMIC_TUPLE_TAG]);
      expect(getAtomTuple(testAtoms, 'p', '3')).to.deep.equal(['p', '3', testAtoms['p']['3'], testAtoms, ATOMIC_TUPLE_TAG]);
      expect(getAtomTuple(testAtoms, 'c', 'hover:red:200')).to.deep.equal(['c', 'hover:red:200', testAtoms['c']['hover:red:200'], testAtoms, ATOMIC_TUPLE_TAG ]);
      expect(getAtomTuple({}, 'c', 'red:200')).deep.to.equal(undefined);
      expect(getAtomTuple(testAtoms, 'c', ['red:200'])).to.deep.equal(undefined);
      expect(getAtomTuple(testAtoms, 2, 'p')).to.deep.equal(undefined);
      expect(getAtomTuple(testAtoms, 'c', 'red:400')).to.deep.equal(undefined);
    });
  });
}

function testAtomInfoAdd() {

  describe('Atom info add', ()=> {
    it('should add atoms correctly',()=>{
      const atoms = {};
      let atomRef = {};

      const c1 = [ 'c', 'red:100', '#rrr100', atoms, ATOMIC_TUPLE_TAG ];
      const c2 = [ 'c', 'red:200', '#rrr200', atoms, ATOMIC_TUPLE_TAG ];
      const c3 = [ 'c', 'grey', 'gggggg', atoms, ATOMIC_TUPLE_TAG ];
      const p1 = [ 'p', '1', '1rem', atoms, ATOMIC_TUPLE_TAG ];
      const p2 = [ 'p', '2', '2rem', atoms, ATOMIC_TUPLE_TAG ];
      const p3 = [ 'p', '3', '3rem', atoms, ATOMIC_TUPLE_TAG ];

      expect(addAtom(atoms, c1[TYPE], c1[SPEC], c1[CSS])).to.deep.equal(c1);
      atomRef = mergeDeepRight(atomRef, tupleToObj(c1));
      expect(atoms).deep.equal(atomRef);

      expect(addAtom(atoms, c2[TYPE], c2[SPEC], c2[CSS])).to.deep.equal(c2);
      atomRef = mergeDeepRight(atomRef, tupleToObj(c2));
      expect(atoms).deep.equal(atomRef);

      expect(addAtom(atoms, p1[TYPE], p1[SPEC], p1[CSS])).to.deep.equal(p1);
      atomRef = mergeDeepRight(atomRef, tupleToObj(p1));
      expect(atoms).deep.equal(atomRef);

      expect(addAtom(atoms, p3[TYPE], p3[SPEC], p3[CSS])).to.deep.equal(p3);
      atomRef = mergeDeepRight(atomRef, tupleToObj(p3));
      expect(atoms).deep.equal(atomRef);

      expect(addAtom(atoms, c3[TYPE], c3[SPEC], c3[CSS])).to.deep.equal(c3);
      expect(addAtom(atoms, c3[TYPE], c3[SPEC], c3[CSS])).to.deep.equal(c3);
      atomRef = mergeDeepRight(atomRef, tupleToObj(c3));
      expect(atoms).deep.equal(atomRef);

      expect(addAtom(atoms, p2[TYPE], p2[SPEC], p2[CSS])).to.deep.equal(p2);
      atomRef = mergeDeepRight(atomRef, tupleToObj(p2));
      expect(atoms).deep.equal(atomRef);

      expect(addAtom([atoms], p2[TYPE], p2[SPEC], p2[CSS])).to.deep.equal(undefined);
      expect(atoms).deep.equal(atomRef);

      expect(addAtom(atoms, undefined, p2[SPEC], p2[CSS])).to.deep.equal(undefined);
      expect(atoms).deep.equal(atomRef);

      expect(addAtom(atoms, {a:'b'}, 'a', 'b')).to.deep.equal(undefined);
      expect(atoms).deep.equal(atomRef);

      expect(addAtom(atoms, p3[TYPE], p3[SPEC], ['abc'])).to.deep.equal(undefined);
      expect(atoms).deep.equal(atomRef);

      expect(addAtom(atoms, p2[TYPE], p2[SPEC], p2[CSS])).to.deep.equal(p2);
      atomRef = mergeDeepRight(atomRef, tupleToObj(p2));
      expect(atoms).deep.equal(atomRef);
    });
  });
}

function testAtomRequests() {
  describe('atom requests', ()=> {

    const pTmplt = 'padding: $1 $2 $3 $4';
    const pbTmplt = 'padding-bottom: $1';
    const mvTmplt = 'margin: $1 0';
    const fxfTmplt = 'flex-flow: $1 $2';

    it('should serve atom spacing requests correctly',()=>{

      const atoms = {};
      let atomRef = {};

      expect(atom(atoms, 'p', mapSpacingKeys, pTmplt, [1])).to.deep.equal(['p', '1', 'padding: 0.25rem;', atoms, ATOMIC_TUPLE_TAG]);
      atomRef = mergeDeepRight(atomRef, tupleToObj(['p', '1', 'padding: 0.25rem;']));
      expect(atoms).deep.equal(atomRef);

      expect(atom(atoms, 'p', mapSpacingKeys, pTmplt, [0, 4, 12, 24])).to.deep.equal(['p', '0:4:12:24', 'padding: 0rem 1rem 3rem 6rem;', atoms, ATOMIC_TUPLE_TAG]);
      atomRef = mergeDeepRight(atomRef, tupleToObj(['p', '0:4:12:24', 'padding: 0rem 1rem 3rem 6rem;']));
      expect(atoms).deep.equal(atomRef);

      expect(atom(atoms, 'pb', mapSpacingKeys, pbTmplt, [3])).to.deep.equal(['pb', '3', 'padding-bottom: 0.75rem;', atoms, ATOMIC_TUPLE_TAG]);
      atomRef = mergeDeepRight(atomRef, tupleToObj(['pb', '3', 'padding-bottom: 0.75rem;']));
      expect(atoms).deep.equal(atomRef);

      expect(atom(atoms, 'mv', mapSpacingKeys, mvTmplt, [0])).to.deep.equal(['mv', '0', 'margin: 0rem 0;', atoms, ATOMIC_TUPLE_TAG]);
      atomRef = mergeDeepRight(atomRef, tupleToObj(['mv', '0', 'margin: 0rem 0;']));
      expect(atoms).deep.equal(atomRef);

      expect(atom(atoms, 'mv', mapSpacingKeys, mvTmplt, [32])).to.deep.equal(['mv', '32', 'margin: 8rem 0;', atoms, ATOMIC_TUPLE_TAG]);
      atomRef = mergeDeepRight(atomRef, tupleToObj(['mv', '32', 'margin: 8rem 0;']));
      expect(atoms).deep.equal(atomRef);

      expect(atom(atoms, 'fxf', mapFlexKeys, fxfTmplt, ['row', 'nowrap'])).to.deep.equal(['fxf', 'row:nowrap', 'flex-flow: row nowrap;', atoms, ATOMIC_TUPLE_TAG]);
      atomRef = mergeDeepRight(atomRef, tupleToObj(['fxf', 'row:nowrap', 'flex-flow: row nowrap;']));
      expect(atoms).deep.equal(atomRef);

    });

    it('should handle invalid atom spacing requests correctly',()=>{

      // const atoms = {};

      // These pass should fail
      // expect(atom(atoms, {}, mapSpacingKeys, mvTmplt, [0])).to.equal('');
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

    const pTmplt = 'padding: $1 $2 $3 $4';
    const mvTmplt = 'margin: $1 0';
    const fxfTmplt = 'flex-flow: $1 $2';

    it('should create atomic functions correctly',()=>{
      const atoms = {};
      let atomRef = {};

      const atomicFns = {};
      atomicFns['p'] = makeAtomicFn(atoms, 'p', mapSpacingKeys, pTmplt);
      atomicFns['mv'] = makeAtomicFn(atoms, 'mv', mapSpacingKeys, mvTmplt);
      atomicFns['fxf'] = makeAtomicFn(atoms, 'fxf', mapFlexKeys, fxfTmplt);
      const { p, mv, fxf } = atomicFns;

      expect(p(0)).to.deep.equal(['p', '0', 'padding: 0rem;', atoms, ATOMIC_TUPLE_TAG ]);
      atomRef = mergeDeepRight(atomRef, tupleToObj(['p', '0', 'padding: 0rem;']));
      expect(atoms).deep.equal(atomRef);

      expect(p(5,6,8,10)).to.deep.equal(['p', '5:6:8:10', 'padding: 1.25rem 1.5rem 2rem 2.5rem;', atoms, ATOMIC_TUPLE_TAG ]);
      atomRef = mergeDeepRight(atomRef, tupleToObj(['p', '5:6:8:10', 'padding: 1.25rem 1.5rem 2rem 2.5rem;']));
      expect(atoms).deep.equal(atomRef);

      expect(mv(20)).to.deep.equal(['mv', '20', 'margin: 5rem 0;', atoms, ATOMIC_TUPLE_TAG ]);
      atomRef = mergeDeepRight(atomRef, tupleToObj(['mv', '20', 'margin: 5rem 0;']));
      expect(atoms).deep.equal(atomRef);

      expect(fxf('row', 'wrap')).to.deep.equal(['fxf', 'row:wrap', 'flex-flow: row wrap;', atoms, ATOMIC_TUPLE_TAG ]);
      atomRef = mergeDeepRight(atomRef, tupleToObj(['fxf', 'row:wrap', 'flex-flow: row wrap;']));
      expect(atoms).deep.equal(atomRef);

      expect(fxf('col', 'rwrap')).to.deep.equal(['fxf', 'col:rwrap', 'flex-flow: column reverse-wrap;', atoms, ATOMIC_TUPLE_TAG ]);
      atomRef = mergeDeepRight(atomRef, tupleToObj(['fxf', 'col:rwrap', 'flex-flow: column reverse-wrap;']));
      expect(atoms).deep.equal(atomRef);
    });
  });
}

function testReactiveAtoms() {

  // TODO: tests are incomplete and test strings are hard coded
  describe('reactive atoms', ()=> {

    const pTmplt = 'padding: $1 $2 $3 $4';
    const mvTmplt = 'margin: $1 0';
    const fxfTmplt = 'flex-flow: $1 $2';

    it('should handle reactive modifiers correctly',()=>{
      const atoms = {};
      let atomRef = {};

      const atomicFns = {};
      atomicFns['p'] = makeAtomicFn(atoms, 'p', mapSpacingKeys, pTmplt);
      atomicFns['mv'] = makeAtomicFn(atoms, 'mv', mapSpacingKeys, mvTmplt);
      atomicFns['fxf'] = makeAtomicFn(atoms, 'fxf', mapFlexKeys, fxfTmplt);
      const { p, mv, fxf } = atomicFns;

      // TODO: need much better way to check against resulting cssStrings, esp RE @media strings, and breakpoints

      let res;
      res = rxSm(p(0));
      expect(res).to.deep.equal([['p', 'sm:0', '@media (min-width: 576px) { padding: 0rem; };', atoms, ATOMIC_TUPLE_TAG]]);
      atomRef = mergeDeepRight(atomRef, tupleToObj(['p', '0', 'padding: 0rem;']));
      atomRef = mergeDeepRight(atomRef, tupleToObj(['p', 'sm:0', '@media (min-width: 576px) { padding: 0rem; };']));
      expect(atoms).deep.equal(atomRef);

      res = rxSm(fxf('row', 'wrap'), mv(32));
      atomRef = mergeDeepRight(atomRef, tupleToObj(['fxf', 'row:wrap', 'flex-flow: row wrap;']));
      atomRef = mergeDeepRight(atomRef, tupleToObj(['fxf', 'sm:row:wrap', '@media (min-width: 576px) { flex-flow: row wrap; };']));
      atomRef = mergeDeepRight(atomRef, tupleToObj(['mv', '32', 'margin: 8rem 0;']));
      atomRef = mergeDeepRight(atomRef, tupleToObj(['mv', 'sm:32', '@media (min-width: 576px) { margin: 8rem 0; };']));
      expect(atoms).deep.equal(atomRef);
    });
  });
}

function testAtomicTransformer() {
  describe('atomic transformer', ()=> {

    const pTmplt = 'padding: $1 $2 $3 $4';
    const mTmplt = 'margin: $1 $2 $3 $4';
    const mvTmplt = 'margin: $1 0';
    const fxfTmplt = 'flex-flow: $1 $2';

    it('should transform atomic input correctly',()=>{

      const atoms = {};
      //let atomRef = {};

      const atomicFns = {};
      atomicFns['p'] = makeAtomicFn(atoms, 'p', mapSpacingKeys, pTmplt);
      atomicFns['m'] = makeAtomicFn(atoms, 'm', mapSpacingKeys, mTmplt);
      atomicFns['mv'] = makeAtomicFn(atoms, 'mv', mapSpacingKeys, mvTmplt);
      atomicFns['fxf'] = makeAtomicFn(atoms, 'fxf', mapFlexKeys, fxfTmplt);
      const { p, m, mv, fxf } = atomicFns;

      // const t1 = fcx(p(1), mv(1));

      const t1 = fcx(p(1), fxf('row', 'nowrap'), rxSm(p(2), mv(8)));
      const t2 = fcx( p(1), m(2), fxf('row', 'nowrap'),
                      rxSm(p(4), m(8), fxf('col', 'nowrap')));





      // <div css={[    p(1), fxf('row', 'nowrap'),
      //             ...rxSm(p(2), m(8)),
      //             ...rxLg(p(4), m(12))  ]}
      // >

      <div css={fcx( p(1), m(2), fxf('row', 'nowrap'),
                     rxSm(p(4), m(8), fxf('col', 'nowrap')))
      >
        <ect/>
      </div>


      console.log('t1: ', t1);
      console.log('t2: ', t2);
      console.log('atoms: ', atoms);



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
      // expect(p(10(atoms, {}, mapSpacingKeys, mvTmplt, [0])).to.equal('');
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
      mapAtomicFns(atoms, atomicFns, cssMap);
      console.log('atomicFns: ', atomicFns);
      console.log('-----------------------------------------------');

      const { ph, ml, mt, mb } = atomicFns;
      const res = fcx(ph(2), ml(8), rxSm(mt(3), mb(4)));
      console.log('res: ', res);
      console.log('atoms: ', atoms);
    });
  });
}
