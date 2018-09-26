import { mapSpacingKeys } from './spacing';

// TODO: different name (atomicMap?)
export const cssMap = {

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

  // color:           { atomType: 'tc',  cssTemplate: 'color: $1' },
  // backGroundColor: { atomType: 'bgc', cssTemplate: 'background-color: $1;' },
  // borderColor:     { atomType: 'bc', cssTemplate: 'border-color: $1;' },

  // fontSize: { atomType: 'fz',  cssTemplate: 'font-size: $1' },
};


