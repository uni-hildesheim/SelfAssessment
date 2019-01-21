import { SetElement } from './set.element.model';

/**
 * The highest level of the test hierarchy.
 * Consists of a number of SetElements which can be
 * either single tests or testgroups.
 */
export class TestSet {
    id: number;
    elements: SetElement[];
}
