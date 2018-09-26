import  { expect } from 'chai';
import { fillCssTemplate, cssKeyToVal, cssKeysToSpec } from '../../src/utils/cssUtils';

export default function runCssUtilTests() {
  describe('css utils', ()=> {
    it('should expand valid input properly',()=>{
      expect(fillCssTemplate(['2rem'], 'padding: $1 $2 $3 $4')).to.equal('padding: 2rem;');
      expect(fillCssTemplate(['2px', '3px'], 'padding: $1 $2 $3 $4')).to.equal('padding: 2px 3px;');
      expect(fillCssTemplate(['2px', '3px', '4px', '5px'], 'padding: $1 $2 $3 $4')).to.equal('padding: 2px 3px 4px 5px;');
      expect(fillCssTemplate(['2em'], 'margin: 0 $1')).to.equal('margin: 0 2em;');
      expect(fillCssTemplate('2em', 'margin: 0 $1')).to.equal('margin: 0 2em;');
      expect(fillCssTemplate(['column', 'nowrap'], 'flex-flow $1 $2')).to.equal('flex-flow column nowrap;');
      expect(fillCssTemplate(['2px', '3px'], 'padding: $1 $1 $2 $2')).to.equal('padding: 2px 2px 3px 3px;');
      expect(fillCssTemplate('str-input', 'padding: $1 $2 $3 $4')).to.equal('padding: str-input;');
    });
    it('should handle invalid input during expand',()=>{
      expect(fillCssTemplate(['2rem'], ['should not be array'])).to.equal('');
      expect(fillCssTemplate({2:'2px'}, 'padding: $1 $2 $3 $4')).to.equal('');
    });
    it('should map cssSpec to correct css value',()=>{
      expect(cssKeyToVal('red:200', { 'red:200':'hit' })).to.equal('hit');
      expect(cssKeyToVal('red:100', { 'red:200':'hit' })).to.equal('');
      expect(cssKeyToVal(2, { 2:12 }, 'rem')).to.equal('12rem');
      expect(cssKeyToVal({}, { 2:12 }, 'rem')).to.equal('');
      expect(cssKeyToVal('red:100', 'red:200')).to.equal('');
    });
    it('should construct cssSpec corretly from list of keys',()=>{
      expect(cssKeysToSpec([1,2,3,4])).to.equal('1:2:3:4');
      expect(cssKeysToSpec(['start','end'])).to.equal('start:end');
      expect(cssKeysToSpec('not-array')).to.equal('');
      expect(cssKeysToSpec()).to.equal('');
    });
  });
}
