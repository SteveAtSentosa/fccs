import  { expect } from 'chai';
import { mapSpacingKeys } from '../../src/maps/spacing';

export default function runSpaceingMapTests() {
  describe('space mapping', ()=> {
    it('should map valid spacing specs properly',()=>{
      expect(mapSpacingKeys([0])).to.deep.equal(['0rem']);
      expect(mapSpacingKeys(['3'])).to.deep.equal(['0.75rem']);
      expect(mapSpacingKeys([8])).to.deep.equal(['2rem']);
      expect(mapSpacingKeys(['10'])).to.deep.equal(['2.5rem']);
      expect(mapSpacingKeys([32])).to.deep.equal(['8rem']);
      expect(mapSpacingKeys([0,32])).to.deep.equal(['0rem', '8rem']);
      expect(mapSpacingKeys([1,2,'3','4'])).to.deep.equal(['0.25rem', '0.5rem', '0.75rem', '1rem']);
    });
    it('should map invalid spacing specs to empty string',()=>{
      expect(mapSpacingKeys([33])).to.deep.equal(['']);
      expect(mapSpacingKeys([''])).to.deep.equal(['']);
      expect(mapSpacingKeys([{8:8}])).to.deep.equal(['']);
      expect(mapSpacingKeys([[8]])).to.deep.equal(['']);
      expect(mapSpacingKeys(['abc'])).to.deep.equal(['']);
      expect(mapSpacingKeys(['abc', 33, undefined, {}, []])).to.deep.equal(['','','','','']);
      expect(mapSpacingKeys()).to.deep.equal([]);
      expect(mapSpacingKeys({8:8})).to.deep.equal([]);
    });
  });
}

