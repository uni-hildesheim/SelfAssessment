import { SetElement } from './set.element.model';

/**
 * The highest level of the test hierarchy.
 * Consists of a number of SetElements which can be
 * either single tests or infopages.
 */
export class TestSet {

    /**
     * Unique ID.
     */
    id: number;

    /**
     * The elements which are part of the set.
     */
    elements: SetElement[];

    /**
     * The score independent evaluation texts.
     */
    scoreIndepentText: string;

    /**
     * The score dependent evaluation texts.
     */
    scoreDependentTexts: [number, string][];
}
