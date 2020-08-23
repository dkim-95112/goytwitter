import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn} from '@angular/forms';
import {Directive, Input} from '@angular/core';

// For reactive form
export function valueMatchingValidator(valueFn: () => string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isValueMatching = valueFn() === control.value;
    return isValueMatching ?
      null : {valueNotMatching: {value: control.value}};
  };
}

// For template form
@Directive({
  selector: '[appValueMatching]',
  providers: [{
    provide: NG_VALIDATORS, useExisting:
    ValueMatchingDirective, multi: true
  }],
})
export class ValueMatchingDirective implements Validator {
  @Input('appValueMatching') otherValueFn: () => string;

  validate(control: AbstractControl): { [key: string]: any } | null {
    return this.otherValueFn ?
      valueMatchingValidator(this.otherValueFn) : null;
  }
}
