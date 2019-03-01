import { Directive, ViewContainerRef } from '@angular/core';

/**
 * This directive is the the anchor directive which tells angular where to dynamicly insert the
 * specific [CategoryComponent]{@link CategoryComponent}.
 * @see https://angular.io/guide/dynamic-component-loader
 */
@Directive({
  selector: '[appTestComponentHost]'
})
export class TestDirective {

  constructor(
    public viewContainerRef: ViewContainerRef
  ) { }

}
