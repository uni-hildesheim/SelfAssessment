import { TestOption } from './testoption.model';
import { SetElement } from './set.element.model';
import { SetElementType } from './enums/element.type.enum';
import { Category } from './enums/category.enum';

/**
 * A single test which may or may not belong to a test group.
 * Implements the SetElement interface because single tests can
 * be a part of a TestSet without belonging to a Testgroup.
 */
export abstract class Test implements SetElement {

    /**
     * Set the appropriate set element type.
     */
    elementType: SetElementType =  SetElementType.TEST;

    /**
     * The specific test-category.
     */
    category: Category;

    /**
     * Unique ID.
     */
    id: string;

    /**
     * The type.
     */
    type: string;

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
     * Indicates whether or not the test should be part of the Evaluation.
     */
    evaluated: boolean;

    /**
     * The number of seconds that the user has to complete the task. If provided the test becomes
     * a `speedtest`.
     */
    seconds?: number;

}
