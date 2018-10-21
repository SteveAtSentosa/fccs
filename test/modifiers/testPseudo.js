import {  expect } from 'chai';
import { mapAtomicFns, fcx } from '../../src/utils/atomicUtils';
import { displayAtomicMap, flexAtomicMap }  from '../../src/maps/layout';
import { spacingAtomicMap } from '../../src/maps/spacing';
import { colorAtomicMap } from '../../src/maps/color';
import { mapResponsiveFns, rxMap } from '../../src/modifiers/responsive';
import { mapPseudoFns, psuedoMap } from '../../src/modifiers/pseudo';

// TODO:
// * Currently there is no real testing, just console logging for visual inspection

export default function runPseudoTests() {
  describe('Psedo selector tests', ()=>{
    testPsuedoAtoms();
    testResponsivePsuedoAtoms();
  });
}
function testPsuedoAtoms() {

  describe('psuedo atoms', ()=> {

    it('should handle psuedo modifiers correctly',()=>{

      const atoms = {};
      const atomicFns = {
        ...mapAtomicFns(atoms, spacingAtomicMap),
        ...mapAtomicFns(atoms, displayAtomicMap),
        ...mapAtomicFns(atoms, flexAtomicMap),
        ...mapAtomicFns(atoms, colorAtomicMap)
      };
      const { p, m, c, bgc, d, fxd } = atomicFns;

      const rfn = mapResponsiveFns(rxMap);
      const { rxMd, rxLg } = rfn;

      const psFns = mapPseudoFns(psuedoMap);
      const { hover } = psFns;

      // const po = hover(p(3), m(4));
      // console.log('po: ', po);

      const res = fcx(
        d('fx'), fxd('col'), p(0), m(0), c('black'), bgc('white'), hover(c('blue:800'), bgc('grey:100')),
        rxMd(p(1), m(1), fxd('row')),
        rxLg(p(2), m(2), fxd('row'))
      );

      console.log('res: ', res);
      // console.log('atoms: ', atoms);

    });
  });
}

function testResponsivePsuedoAtoms() {

  describe('responsive psuedo atoms', ()=> {

    it('should handle responsive psuedo modifiers correctly',()=>{

      const atoms = {};

      const atomicFns = {
        ...mapAtomicFns(atoms, spacingAtomicMap),
        ...mapAtomicFns(atoms, displayAtomicMap),
        ...mapAtomicFns(atoms, flexAtomicMap),
        ...mapAtomicFns(atoms, colorAtomicMap)
      };
      const { p, m, c, bgc, d, fxd } = atomicFns;

      const rxFns = mapResponsiveFns(rxMap);
      const { rxLg, rxSm } = rxFns;

      const psFns = mapPseudoFns(psuedoMap);
      const { hover } = psFns;

      const pro = fcx(
        p(0), c('black'), hover(c('blue'), rxSm(p(8))),
        rxLg(p(1), hover(c('red')))
      );

      console.log('pro: ', pro);

    });
  });
}
