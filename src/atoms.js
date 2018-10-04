
const atoms = {};

// atoms = {
//   pt : { <-- atom type
//     1:            'padding-top: 0.25rem', <-- an atom,  applied via atomic fxn pt(1)
//     2:            'padding-top: 0.5rem'   <-- another atom, applied via atomic fxn pt(2)
//     ^              ^                 ^
//     cssSpec        cssStr (css string or classname, depening upon definition of toClass())
//
//   c : { <-- a second atom type
//     red:           'color:     #c62828',  <-- an atom, applied via atomic fxn c('red')
//   }                ^cssProp    ^cssVal
// }

const atomicFns = {};

// atomicFunctions = {
//   pt: cssSpec -> corresponding cssStr (or class if you apply toClass fxn)
// }
//
// Example usages (w react and emotion prop css):
//    { pt } = atomicFunctions;
//    pt(2) //=> padding-top: 0.5rem
//    return <div css={[ pt(2) ]} some text </div>

