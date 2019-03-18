import { Directive, Input, ElementRef, Renderer2, OnChanges } from '@angular/core';

/**
 * Directive that hides the mat-stepper while the journal is being updated.
 */
@Directive({
    selector: '[appLoadComp]',
})
export class LoadingComponentDirective implements OnChanges {

    /**
     * The changing value from the parent.
     */
    @Input('appLoadComp') loading: boolean;

    /**
     * Constructor for the Loading Component.
     */
    constructor(
      private elRef: ElementRef,
      private renderer: Renderer2) {
    }

    /**
     * Check on every change if component needs to be hidden.
     */
    ngOnChanges() {
        if (this.loading) {
            this.addHideClass();
        } else {
            this.removeHideClass();
        }
    }

    /**
     * Hide the mat-stepper.
     */
    addHideClass() {
        this.renderer.addClass(this.elRef.nativeElement.querySelector('.mat-horizontal-stepper-header-container'), 'hide-stepper');
    }

    /**
     * Show the mat-stepper.
     */
    removeHideClass() {
        this.renderer.removeClass(this.elRef.nativeElement.querySelector('.mat-horizontal-stepper-header-container'), 'hide-stepper');
    }

}
