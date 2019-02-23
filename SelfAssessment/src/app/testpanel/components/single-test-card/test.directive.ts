import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appTestComponentHost]'
})
export class TestDirective {

  constructor(
    public viewContainerRef: ViewContainerRef
  ) { }

}
