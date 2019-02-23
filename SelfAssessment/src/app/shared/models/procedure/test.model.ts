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

    elementType: SetElementType =  SetElementType.TEST;

    category: Category;

    /**
     * Unique ID.
     */
    id: number;

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
     * Indicates whether or not the test should be
     * part of the Evaluation.
     */
    evaluated: boolean;

}
