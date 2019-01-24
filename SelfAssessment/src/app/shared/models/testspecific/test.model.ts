import { TestOption } from './testoption.model';
import { SetElement } from './set.element.model';

/**
 * A single test which may or may not belong to a test group.
 * Implements the SetElement interface because single tests can
 * be a part of a TestSet without belonging to a Testgroup.
 */
export class Test implements SetElement {

    /**
     * Unique ID.
     */
    id: number;

    /**
     * The type.
     */
    type: string;

    /**
     * Category e.g. multiple-options, radio-buttons etc.
     */
    category: string;

    /**
     * The description.
     */
    description: string;

    /**
     * The task.
     */
    task: string;

    /**
     * Options which contains the possible test answers.
     */
    options: TestOption[];

    /**
     * Indicates whether or not the test should be
     * part of the Evaluation.
     */
    evaluated: boolean;

    /**
     * The header for 'multiple-options' tests.
     */
    header: string[];

    /**
     * Type for the SelElement.
     */
    setType = 'test';
}
