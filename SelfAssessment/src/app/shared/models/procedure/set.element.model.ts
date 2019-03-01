import { SetElementType } from './enums/element.type.enum';

/**
 * Interface implemented by classes that are a part of a
 * test set (test/infopage).
 */
export interface SetElement {

    /**
     * Unique ID.
     */
    id: string;

    /**
     * The type of the element.
     */
    elementType: SetElementType;
}
