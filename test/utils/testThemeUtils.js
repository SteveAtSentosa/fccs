import  { expect } from 'chai';
import { reflect } from '../../src/utils/typeUtils';
import { theme } from '../../src/maps/theme';
import { colorAtomicMap } from '../../src/maps/color';
import { makeThemeMapFn } from '../../src/utils/themeUtils';
import { fcx } from '../../src/utils/atomicUtils';


// TODO:
// * This is only cusory testing, full test suite needed
// * Consider creating a local theme here for testing (to decouple from defaults)

export default function runThemeUtilTests() {
  describe('theme utils', ()=> {
    it('should map theme props correctly',()=>{
      expect(makeThemeMapFn(theme, 'color')('@standOut')).to.deep.equal(['cyan:700']);
      expect(makeThemeMapFn(theme, 'color')(1)).to.deep.equal([1]);
      expect(makeThemeMapFn(theme, 'backgroundColor')('@forTesting')).to.deep.equal(['red:200']);
      expect(makeThemeMapFn(theme, 'backgroundColor')('blue:200', '@dark')).to.deep.equal(['blue:200', 'grey:600']);
    });


    it('should use atomic theme mapping correctly',()=>{ // Is this the right place for this??

      const atoms = {};

      // export const mapAtomicFns2 = (atoms, atomicMap, withTheme, theme) =>

      // const tempAtomicMap = {
      //   color: colorAtomicMap.color
      // };


      // export const mapThemeProp = curry(
      //   (theme, themeType, applyTo) =>
      //     isThemeProp(applyTo) ? themePropToCssSpec(theme, themeType, applyTo.substr(1)) : applyTo
      // );

      // const atomicFns = {
      //   ...mapAtomicFns2(atoms, tempAtomicMap, withTheme, theme, mapThemeProp(theme, 'color'))
      // };
      // const { c } = atomicFns;

      // const c1 = c('@standOut');
      // console.log('c1: ', c1);

      // console.log('c1: ', c1);


    });

  });
}
