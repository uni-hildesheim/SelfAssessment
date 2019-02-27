import { MultipleChoice } from 'src/app/shared/models/procedure/categories/multiple.choice.test';
import { OptionPipe } from './option.pipe';
import { resultSetDummy } from 'src/app/spec-helper/dummy.values';

describe('OptionPipe', () => {
  const pipe = new OptionPipe();
  const resultTestRadioButtons = resultSetDummy[0].tests[0];
  const resultTestMultipleChoice = resultSetDummy[1].tests[0];
  const resultTestMultipleOptions = resultSetDummy[1].tests[1];
  const resultTestSpeed = resultSetDummy[0].tests[1];


  it('should transform the radio-button/multiple-choice category', () => {
    expect(pipe.transform(resultTestRadioButtons, 0, false)).toEqual('dummy first option');
    expect(pipe.transform(resultTestMultipleChoice, 0, false)).toEqual('dummy first option');
  });

  it('should transform the multiple-options category', () => {
    expect(pipe.transform(resultTestMultipleOptions, 0, false)).toEqual('dummy first option: No');
  });

  it('should transform the speed category', () => {
    expect(pipe.transform(resultTestSpeed, 0, false)).toContain(`<span class='wrong-pick'>ummy</span>`);
  });

});
