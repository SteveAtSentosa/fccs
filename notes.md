# css maps

maps a cssKey to a uniqe css value
```
spacingMap  = { 1:           '0.25rem', ... }
colorMap    = { 'red:200 :   '#ef9a9a' ... }
                 ^cssKeys     ^cssVals
```

# Atomic Structure
```
atoms = {

  pt : { <--- atom type
    1:        'padding-top: 0.25rem', <-- a css atom, applied via atomic fxn pt(1)
    2:        'padding-top: 0.5rem'   <-- another css atom, applied via atomic function pt(2)
    ^          ^                 ^
    cssSpec    cssStr (css string or classname, depening upon definition of toClass())

  c : { <----- a second atom type
    'red':     'color:     #c62828',  <-- a css atom, applied via atomic function.c('red')
    'red:300': 'color:     #c62828',  <-- a css atom, applied via atomic function.c('red')
  }                ^cssProp    ^cssVal

  b : { <----- a third atom type
    border {
      'thin:red' : 'border: 1px solid red';
    }
}
```

a cssSpec is made up of 1 or more cssKey's, seperated by ':' and maps to a unique cssString.
Modifers for media queries (eg 'sm:red:100') and psuedoselectors (eg) 'hover:red:100' may also be included
atoms = {
  p: {
    '1:2:3:4': 'padding: 1px 2px 3px 4px;'
    'sm:2:4': '@media (min-width: 576px) { padding: 2px 4px; }'
  }
  c: {
    'hover:red': '&:hover { color: green; }';
  }
}

```
padding:       { atomType: 'p',  cssStr: 'padding:    $1 $2 $3 $4;' },
                                          ^css        ^  ^  ^  ^ template slots
                                           template
```
cssSpecMapFn: given cssSpec, return cssValue
atomicFn: given an atomType and a cssSpec, return corresponding atom
makeAtomicFn:

