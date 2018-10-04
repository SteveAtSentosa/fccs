import runTypeUtilTests from './utils/testTypeUtils';
import runCssUtilTests from './utils/testCssUtils';
import runAtomicUtilTests from './utils/testAtomicUtils';
import runAtomicFunctionTests from './utils/testAtomicFunctions';
import runSpacingTests from './styling/testSpacing';
import runColorTests from './styling/testColor';
import runLayoutTests from './styling/testLayout';
import runResponsiveTests from './modifiers/testResponsive';



describe('fccs tests', ()=>{
  runTypeUtilTests();
  runCssUtilTests();
  runAtomicUtilTests();
  runAtomicFunctionTests();
  runSpacingTests();
  runColorTests();
  runLayoutTests();
  runResponsiveTests();
});
