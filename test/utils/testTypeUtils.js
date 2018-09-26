import  { expect } from 'chai';
import { toStr, tupleToObj, unique } from '../../src/utils/typeUtils';

export default function runTypeUtilTests() {
  describe('type utils', ()=> {
    it('should convert to string properly',()=>{
      expect(toStr('abc')).to.equal('abc');
      expect(toStr(12)).to.equal('12');
      expect(toStr(234.43)).to.equal('234.43');
    });
    it('should convert tuples to objects correctly',()=>{
      expect(tupleToObj(['c', 'red', '#rrrrrr' ])).to.deep.equal({c:{red: '#rrrrrr' }});
      expect(tupleToObj(['c', 'red:100', '#rrr100' ])).to.deep.equal({c:{'red:100': '#rrr100' }});
      expect(tupleToObj(['p', 1, 'padding: 1rem' ])).to.deep.equal({p:{1: 'padding: 1rem' }});
    });
    it('remove array duplicates correctly',()=>{
      expect(unique([1, 1, 1, 1])).to.deep.equal([1]);
      expect(unique(['aaa', 'aaa', 'bbb', 'bbb'])).to.deep.equal(['aaa', 'bbb']);
      expect(unique(['1', 1, '1', 1])).to.deep.equal(['1', 1]);
    });
  });
}

