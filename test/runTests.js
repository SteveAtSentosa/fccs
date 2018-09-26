import runTypeUtilTests from './utils/testTypeUtils';
import runCssUtilTests from './utils/testCssUtils';
import runAtomUtilTests from './utils/testAtomsUtils';
import runMappingTests from './maps/testSpacingMap';
import runAtomTests from './testAtoms';

describe('fccs tests', ()=>{
  runTypeUtilTests();
  runMappingTests();
  runCssUtilTests();
  runAtomUtilTests();
});
