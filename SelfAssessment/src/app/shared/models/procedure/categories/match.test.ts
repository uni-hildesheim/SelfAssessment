import { Test } from '../test.model';
import { Category } from '../enums/category.enum';

/**
 * User has to select a substring from a given option.
 * The choosen substring is identified via the actual string value and the index which has to be
 * provided in the course configuration file.
 */
export class Match extends Test {
    /**
     * Assign match enum value.
     */
    category: Category =  Category.MATCH;
}
