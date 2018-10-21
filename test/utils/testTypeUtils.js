import  { expect } from 'chai';
import { toStr, isNonEmptyStr, isFn, isNumOrNonEmptyStr, unique } from '../../src/utils/typeUtils';

export default function runTypeUtilTests() {
  describe('type utils', ()=> {
    it('should convert to string properly',()=>{
      expect(toStr('abc')).to.equal('abc');
      expect(toStr(12)).to.equal('12');
      expect(toStr(234.43)).to.equal('234.43');
    });
    it('remove array duplicates correctly',()=>{
      expect(unique([1, 1, 1, 1])).to.deep.equal([1]);
      expect(unique(['aaa', 'aaa', 'bbb', 'bbb'])).to.deep.equal(['aaa', 'bbb']);
      expect(unique(['1', 1, '1', 1])).to.deep.equal(['1', 1]);
    });
    it('detect types correctly',()=>{
      expect(isNonEmptyStr('abc')).to.equal(true);
      expect(isNonEmptyStr('')).to.equal(false);
      expect(isNonEmptyStr([])).to.equal(false);
      expect(isNonEmptyStr({})).to.equal(false);

      expect(isNumOrNonEmptyStr(1)).to.equal(true);
      expect(isNumOrNonEmptyStr(99.99)).to.equal(true);
      expect(isNumOrNonEmptyStr('abc')).to.equal(true);
      expect(isNumOrNonEmptyStr('')).to.equal(false);
      expect(isNumOrNonEmptyStr([])).to.equal(false);
      expect(isNumOrNonEmptyStr({})).to.equal(false);

      expect(isFn(()=>null)).to.equal(true);
      expect(isFn({})).to.equal(false);
      expect(isFn('abc')).to.equal(false);
      expect(isFn([])).to.equal(false);
    });
  });
}


