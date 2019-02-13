import { Directive, Input, ElementRef, Renderer2, OnChanges } from '@angular/core';

/**
 * Directive to handle the image src of every image.
 */
@Directive({
    selector: '[appLoadComp]',
})
export class LoadingComponentDirective implements OnChanges {

    @Input('appLoadComp') loading: boolean;


    constructor(private elRef: ElementRef, private renderer: Renderer2) {
    }

    ngOnChanges() {
        if (this.loading) {
            this.addHideClass();
        } else {
            this.removeHideClass();
        }
    }

    addHideClass() {
        this.renderer.addClass(this.elRef.nativeElement.querySelector('.mat-horizontal-stepper-header-container'), 'hide-stepper');
    }

    removeHideClass() {
        this.renderer.removeClass(this.elRef.nativeElement.querySelector('.mat-horizontal-stepper-header-container'), 'hide-stepper');
    }

}
