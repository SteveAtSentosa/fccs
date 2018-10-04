import { makeKeyMapFn } from '../utils/mappingUtils';

export const spacingKeyMap = {
  unit: 'rem',
  vals: {
    0: 0, 1: 0.25, 2: 0.5, 3: 0.75, 4: 1, 5: 1.25,
    6: 1.5, 8: 2, 10: 2.5, 12: 3, 16: 4, 20: 5, 24: 6, 32: 8,
  }
};

// mapSpacingKey([5]) //=> ['1.25rem']
// mapSpacingKey(5) //=> ['1.25rem']
// mapSpacingKey([4,6]) //=> ['1rem', 1.5rem']
// mapSpacingKey([99, {}]) //=> ['', ''] (unkown or invalid keys)
export const mapSpacingKeys = makeKeyMapFn(spacingKeyMap);

export const spacingAtomicMap = {
  padding:       { atomType: 'p',  cssTemplate: 'padding: $1 $2 $3 $4', mapFn: mapSpacingKeys },
  paddingTop:    { atomType: 'pt', cssTemplate: 'padding-top: $1',      mapFn: mapSpacingKeys },
  paddingBottom: { atomType: 'pb', cssTemplate: 'padding-bottom: $1',   mapFn: mapSpacingKeys },
  paddingLeft:   { atomType: 'pl', cssTemplate: 'padding-left: $1',     mapFn: mapSpacingKeys },
  paddingRight:  { atomType: 'pr', cssTemplate: 'padding-right: $1',    mapFn: mapSpacingKeys },
  paddingVert:   { atomType: 'pv', cssTemplate: 'padding: $1 0',        mapFn: mapSpacingKeys },
  paddingHoriz:  { atomType: 'ph', cssTemplate: 'padding: 0 $1',        mapFn: mapSpacingKeys },
  margin:        { atomType: 'm',  cssTemplate: 'margin: $1 $2 $3 $4',  mapFn: mapSpacingKeys },
  marginTop:     { atomType: 'mt', cssTemplate: 'margin-top: $1',       mapFn: mapSpacingKeys },
  marginBottom:  { atomType: 'mb', cssTemplate: 'margin-bottom: $1',    mapFn: mapSpacingKeys },
  marginLeft:    { atomType: 'ml', cssTemplate: 'margin-left: $1',      mapFn: mapSpacingKeys },
  marginRight:   { atomType: 'mr', cssTemplate: 'margin-right: $1',     mapFn: mapSpacingKeys },
  marginVert:    { atomType: 'mv', cssTemplate: 'margin: $1 0',         mapFn: mapSpacingKeys },
  marginHoriz:   { atomType: 'mh', cssTemplate: 'margin: 0 $1',         mapFn: mapSpacingKeys },
};


