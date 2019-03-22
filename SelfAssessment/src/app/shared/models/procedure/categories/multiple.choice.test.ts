import { Test } from '../test.model';
import { Category } from '../enums/category.enum';

/**
 * User has to check one or more answers. The options are displayed next to the checkboxes.
 */
export class MultipleChoice extends Test {
    /**
     * Assign the correct enum value.
     */
    category: Category =  Category.MULTIPLE_CHOICE;
}
