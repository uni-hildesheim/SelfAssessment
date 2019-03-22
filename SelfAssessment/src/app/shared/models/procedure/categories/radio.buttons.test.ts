import { Test } from '../test.model';
import { Category } from '../enums/category.enum';

/**
 * User has to choose one of the possible options.
 */
export class RadioButtons extends Test {

    /**
     * Assign the correct enum value.
     */
    category: Category =  Category.RADIO_BUTTONS;
}
