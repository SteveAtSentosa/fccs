
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


const theme = {

  // Universal theme props.  Can be applied to any atom / theme-type

  // Universal app colors colors
  primaryOne: 'deepPurple:700',
  primaryTwo: 'amber:700',
  complimentaryOne: 'blue:a200',
  complimentaryTwo: 'cyan:600',

  // grey scale
  white: 'white',
  black: 'black',
  darkest: 'grey:800',
  darker: 'grey:700',
  dark: 'grey:600',
  medium: 'grey:500',
  light: 'grey:400',
  lighter: 'grey:300',
  lightest: 'grey:200',

  // spacing TODO: (just for testing, needs to be better thought through)
  veryNarrow: 1,
  narrow: 2,
  wide: 8,
  veryWide: 32,

  // Theme types
  // When applying a theme to a particular atomic type these types will be applied if
  // themeType:ThemeProp ispresent, otherwise the universal theme value will be applied

  backgroundColor: {
    forTesting: 'red:200'
  },
  color: {
    standOut: 'cyan:700',
  }
};

export { theme };
export default theme;

