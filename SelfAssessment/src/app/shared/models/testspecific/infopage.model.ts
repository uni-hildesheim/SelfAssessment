import { SetElement } from './set.element.model';

/**
 * Page that offers help for solving a test/testgroup.
 */
export class Infopage implements SetElement {

    /**
     * Unique ID.
     */
    id: number;

    /**
     * The helptext.
     */
    text: string;

    /**
     * IDs of the tests/testgroups/sets before which
     * the helptext should be displayed.
     */
    belongs: number[];

    /**
     * The type of the SetElement.
     */
    setType = 'infopage';
}
