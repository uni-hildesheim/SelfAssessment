import { Injectable } from '@angular/core';

/**
 * Contains the indices of the current set and current
 * set element. Can be injected to any element that requires
 * information about the current test state.
 */
@Injectable()
export class GlobalIndicator {

    /**
     * Index of the current set.
     */
    setIndex = 0;

    /**
     * Index of the current set element.
     */
    setElemIndex = 0;
}
