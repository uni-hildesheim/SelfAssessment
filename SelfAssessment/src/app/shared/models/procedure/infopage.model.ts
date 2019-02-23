import { SetElement } from './set.element.model';
import { SetElementType } from './enums/element.type.enum';

/**
 * Page that offers help for solving a test/testgroup.
 */
export class Infopage implements SetElement {

    elementType: SetElementType = SetElementType.INFOPAGE;

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


}
