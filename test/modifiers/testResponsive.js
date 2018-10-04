import  {  expect } from 'chai';
import { mapAtomicFns } from '../../src/utils/atomicUtils';
import { flexAtomicMap }  from '../../src/maps/layout';
import { spacingAtomicMap } from '../../src/maps/spacing';
import { colorAtomicMap } from '../../src/maps/color';
import { rxSm, makeReponsiveFns, responsiveOutput } from '../../src/modifiers/responsive';

// import { mergeDeepRight } from 'ramda';
// import { mapSpacingKeys, spacingKeyMap, spacingAtomicMap } from '../../src/maps/spacing';
// import { mapFlexKeys } from '../../src/maps/layout';
// // import { cssMap } from '../../src/maps/css';
// import { cssKeysToSpec, fillCssTemplate } from '../../src/utils/cssUtils';
// import { vectorToAtom, sampleKeys, numTemplateSlots, randNumTemplateSlots } from '../../src/utils/testUtils';

// import {
//   ATOMIC_V_TAG,
//   validAtomInput, getAtomCss, atomProp, atomExists, mapAtomicFns,
//   getAtomicVector, addAtom, atom, makeAtomicFn, fcx, /* rxSm */ }
//   from '../../src/utils/atomicUtils';

export default function runResponsiveTests() {
  describe('Atomoic request tests', ()=>{
    testResponsiveAtoms();
  });
}

function testResponsiveAtoms() {

  describe('responsive atoms', ()=> {

    const padTemplate = 'padding: $1 $2 $3 $4';
    const mrgVertTmplt = 'margin: $1 0';
    const fxfTmplt = 'flex-flow: $1 $2';

    it('should handle reactive modifiers correctly',()=>{

      const atoms = {};
      let atomRef = {};

      const atomicFns = {
        ...mapAtomicFns(atoms, spacingAtomicMap),
        ...mapAtomicFns(atoms, flexAtomicMap),
        ...mapAtomicFns(atoms, colorAtomicMap)
      };

      const { p, m, mv, fxf } = atomicFns;
      const res = rxSm(p(0), m(1));
      console.log('res: ', res);

      console.log('atoms: ', atoms);
      // const av = p(2);
      // console.log('av: ', av);


      // const tr = responsiveOutput('rxSm', av);
      // console.log('tr: ', tr);
      // const rf = makeReponsiveFns();
      // console.log('rf: ', rf);

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

// function testAtomicTransformer() {
//   describe('atomic transformer', ()=> {

//     const padTemplate = 'padding: $1 $2 $3 $4';
//     const mTmplt = 'margin: $1 $2 $3 $4';
//     const mrgVertTmplt = 'margin: $1 0';
//     const fxfTmplt = 'flex-flow: $1 $2';

//     it('should transform atomic input correctly',()=>{

//       const atoms = {};
//       //let atomRef = {};

//       const atomicFns = {};
//       atomicFns['p'] = makeAtomicFn(atoms, 'p', mapSpacingKeys, padTemplate);
//       atomicFns['m'] = makeAtomicFn(atoms, 'm', mapSpacingKeys, mTmplt);
//       atomicFns['mv'] = makeAtomicFn(atoms, 'mv', mapSpacingKeys, mrgVertTmplt);
//       atomicFns['fxf'] = makeAtomicFn(atoms, 'fxf', mapFlexKeys, fxfTmplt);
//       const { p, m, mv, fxf } = atomicFns;

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

//     });
// }
