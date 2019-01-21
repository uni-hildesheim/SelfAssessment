import { TestOption } from './testoption.model';
import { SetElement } from './set.element.model';
import { Infopage } from './infopage.model';

/**
 * A single test which may or may not belong to a test group.
 * Implements the SetElement interface because single tests can
 * be a part of a TestSet without belonging to a Testgroup.
 */
export class Test implements SetElement {

    id: number;
    type: string;
    category: string;
    description: string;
    task: string;
    options: TestOption[];
    evaluated: boolean;
    header: string[];
    setType = 'test';
}
