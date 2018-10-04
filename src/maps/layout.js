import { arraifyAndReflect } from '../utils/typeUtils';
import { makeKeyMapFn } from '../utils/mappingUtils';


export const displayKeyMap = {
  unit: '',
  vals: {
    b: 'block',
    ib: 'inline-block',
    i: 'inline',
    t: 'table',
    tr: 'table-row',
    tc: 'table-cell',
    h: 'hidden',
    fx: 'flex',
    ifx: 'inline-flex'
  }
};

export const mapDisplayKeys = makeKeyMapFn(displayKeyMap);

export const displayAtomicMap = { display: { atomType: 'd',  cssTemplate: 'display: $1', mapFn: mapDisplayKeys }};

export const flexKeyMap = {
  unit: '',
  vals: {
    row: 'row',
    rrow: 'reverse-row',
    col: 'column',
    rcol: 'reverse-column',
    wrap: 'wrap',
    nowrap: 'nowrap',
    rwrap: 'reverse-wrap',
    fs: 'flex-start',
    fe: 'flex-end',
    c: 'center',
    sb: 'space-between',
    sa: 'space-around',
    bl: 'baseline',
    s: 'stretch'
  }
};

export const mapFlexKeys = makeKeyMapFn(flexKeyMap);

export const flexAtomicMap = {
  flexDirection:  { atomType: 'fxd', cssTemplate: 'flex-direction: $1', mapFn: mapFlexKeys },
  flexWrap:       { atomType: 'fxw', cssTemplate: 'flex-wrap: $1',      mapFn: mapFlexKeys },
  flexFlow:       { atomType: 'fxf', cssTemplate: 'flex-flow: $1 $2',   mapFn: mapFlexKeys },
  alignItems:     { atomType: 'ai',  cssTemplate: 'align-items: $1',    mapFn: mapFlexKeys },
  justifyContent: { atomType: 'jc',  cssTemplate: 'padding-left: $1',   mapFn: mapFlexKeys },
  alignContent:   { atomType: 'ac',  cssTemplate: 'align-content: $1',  mapFn: mapFlexKeys },
  alignSelf:      { atomType: 'mt',   cssTemplate: 'margin-top: $1',    mapFn: mapFlexKeys },

  // these passthrough input, rather than map
  order:          { atomType: 'ord',  cssTemplate: 'order: $1',         mapFn: arraifyAndReflect },
  flexGrow:       { atomType: 'fxg',  cssTemplate: 'flex-grow: $1',     mapFn: arraifyAndReflect },
  flexShrink:     { atomType: 'fxs',  cssTemplate: 'flex-shrink: $1',   mapFn: arraifyAndReflect },
  flexBasis:      { atomType: 'fxb',  cssTemplate: 'flex-basis: $1',    mapFn: arraifyAndReflect },
  flex:           { atomType: 'fx',   cssTemplate: 'flex: $1 $2 $3',    mapFn: arraifyAndReflect },
};


// flex-direction flex-wrap|initial|inherit;
