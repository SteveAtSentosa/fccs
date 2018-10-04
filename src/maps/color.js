
import { isStr, isObj, isArrOrStr, arrayify, isUndef } from '../utils/typeUtils';

// This module defines a color pallete based on a base color name, and associated shades
// A default color is also defined for cases where no shade, or unknown shade is specified

//*************************************************************************************************
// The color pallete definition
//*************************************************************************************************

// The definitions below allow for any color pallete to be defined
// example shades for a material design pallete: 'grey' 'grey:100', 'cyan:a400'
// example shades for a tailwind like pallete: 'grey' 'grey:lighter', 'cyan:darkest'

// Material design color pallete

export const shades = [
  '50', '100', '200', '300', '400', '500', '600', '700', '800', '900',
  'a100', 'a200', 'a400', 'a700'
];

export const colors = {
  black: '#22292f',
  white: '#ffffff',
  grey: {
    dflt: '#757575',
    range: [ '#fafafa', '#f5f5f5', '#eeeeee', '#e0e0e0', '#bdbdbd', '#9e9e9e', '#757575', '#616161', '#424242', '#212121' ],
  },
  amber: {
    dflt: '#ff8f00',
    range: [ '#fff8e1', '#ffecb3', '#ffe082', '#ffd54f', '#ffca28', '#ffc107', '#ffb300', '#ffa000', '#ff8f00', '#ff6f00', '#ffe57f', '#ffd740', '#ffc400', '#ffab00', ],
  },
  blue: {
    dflt: '#1565c0',
    range: [ '#e3f2fd' ,'#bbdefb' ,'#90caf9' ,'#64b5f6' ,'#42a5f5' ,'#2196f3' ,'#1e88e5' ,'#1976d2' ,'#1565c0' ,'#0d47a1' ,'#82b1ff' ,'#448aff' ,'#2979ff' ,'#2962ff', ],
  },
  cyan: {
    dflt: '#00acc1',
    range: [ '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064', '#84ffff', '#18ffff', '#00e5ff', '#00b8d4', ],
  },
  deepPurple: {
    dflt: '#512da8',
    range: [ '#ede7f6', '#d1c4e9', '#b39ddb', '#9575cd', '#7e57c2', '#673ab7', '#5e35b1', '#512da8', '#4527a0', '#311b92', '#b388ff', '#7c4dff', '#651fff', '#6200e', ],
  },
  red: {
    dflt: '#c62828',
    range: [ '#ffebee', '#ffcdd2', '#ef9a9a', '#e57373', '#ef5350', '#f44336', '#e53935', '#d32f2f', '#c62828', '#b71c1c', '#ff8a80', '#ff5252', '#ff1744', '#d5000', ],
  },
};

// input exmaples: 'grey', ['grey:100'  'cyan:a400']
// outputs list of corresponding css color or '' on bad input
export const mapColorKeys = colorKeys =>
  isArrOrStr(colorKeys) ? arrayify(colorKeys).map(key=>mapColorKey(key)) : [];

export const colorAtomicMap = {
  color:           { atomType: 'c',   cssTemplate: 'color: $1',            mapFn: mapColorKeys },
  backgroundColor: { atomType: 'bgc', cssTemplate: 'background-color: $1', mapFn: mapColorKeys },
  borderColor:     { atomType: 'bc',  cssTemplate: 'border-color: $1',     mapFn: mapColorKeys },
};


//*************************************************************************************************
// Internal helpers
//*************************************************************************************************

const indexedShades = shades.reduce((acc, shd, idx)=>({...acc, [shd]:idx}), {});

// input exmaples: 'grey' 'grey:100'  'cyan:a400'
// outputs corresponding css color or '' on bad input
export const mapColorKey = colorKey => {

  if (!isStr(colorKey)) return '';

  const { colorName, shadeName } = explodeColorKey(colorKey);
  const { range, dflt } = getColorData(colorName, shadeName);
  const shadeIdx = indexedShades[shadeName];

  if (isUndef(range) && isUndef(dflt)) return '';       // unkonwn color, return empty string
  if (isUndef(range) || isUndef(shadeIdx)) return dflt; // no range, or no index, return default
  return range[shadeIdx];
};


// eg: 'grey:100' -> { colorName: 'grey', shadeName: '100' }
const explodeColorKey = colorKey => ({
  colorName: colorKey.split(':')[0],
  shadeName: colorKey.split(':')[1], // undefined if no shade provided
});

// Returns { dflt: '', range: [] }
// For color ranges, the colors dflt & range info is returned directly
// For single value colors, like black, dflt set to color value, range set to undefined
// For unkown colors, dflt and range set to undefined
const getColorData = colorName => {
  if (isObj(colors[colorName])) return colors[colorName];
  if (isStr(colors[colorName])) return { dflt: colors[colorName], range: undefined };
  return { dflt: undefined, range: undefined };
};
