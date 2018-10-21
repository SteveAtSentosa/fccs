// TODO:
// * I feel like this can be cleaned up
// * Run through path of say c('@primaryOne'), and check input/output types in the pipeline

import { path, curry, prop, pipe } from 'ramda';
import { isStr, isObj, isUndef, isArrOrStr, isFn, arrayify, flatten } from './typeUtils';

// const theme = {
//
//   /* Global theme properties */
//
//   complimentaryOne:       'cyan:600',
//   ^ global themeProp       ^ themeVal
//
//  /* Theme properties specific to atomic types */
//
//  backgroundColor: {
//  ^ themeType
//    light:       'grey:100',
//    dark:        'purpble:800',
//    ^ themeProp  ^themeVal
// },

// check for a theme value
const isThemeProp = toCheck => isStr(toCheck) && toCheck.charAt(0) === '@';

// return theme type specific them property if it exists, otherwise return undefined
const getTypedThemeProp = (theme, themeType, themeProp) =>
  isObj(theme) && !isUndef(theme[themeType]) && !isUndef(theme[themeType][themeProp]) ?
  theme[themeType][themeProp] : undefined;

// return theme type specific them property if it exists, otherwise return undefined
const getGlobalThemeProp = (theme, themeProp) =>
  isObj(theme) && !isUndef(theme[themeProp]) ? theme[themeProp] : undefined;


// convert tagged theme prop to raw theme prop or passthrough non theme props
const raw = themeProp =>
  isStr(themeProp) && themeProp[0] === '@' ? themeProp.substr(1) : themeProp;

// create type secific theme mapping function that recieves an themeProp, or array of themeProps, and return
// a list of the corresponding cssKeys
export const makeThemeMapFn = (theme, themeType) => (...themeProps) =>
  !isObj(theme) || !isStr(themeType) ?
  themeProps :
  flatten(themeProps).map(themeProp => // allows list or seperate args or single arg to be pased in // TODO: doc this better
    getTypedThemeProp(theme, themeType, raw(themeProp)) || // check for type specific prop first
    getGlobalThemeProp(theme, raw(themeProp))           || // check for global prop next
    themeProp                                              // pass themeProp through if not found on theme
  );

// // if you only need access to global theme props
// export const globalThemeMapper = theme => makeThemeMapFn(theme, '');

// // create type secific theme mapping function
// export const makeThemeMapFn = (theme, themeType) => themeProp => {

//   if (!isObj(theme) || !isStr(themeType) || !isThemeProp(themeProp))
//     return themeProp;

//   const rawThemeProp = themeProp.substr(1);

//   return getTypedThemeProp(theme, themeType, rawThemeProp) || // check for type specific prop first
//          getGlobalThemeProp(theme, rawThemeProp) ||           // check for global prop next
//          themeProp;                                           // pass themeProp through if not found on theme
// };
