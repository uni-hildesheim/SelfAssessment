import { Test } from '../test.model';
import { Category } from '../enums/category.enum';

/**
 * This category combines every option with an array of possible header values. The user has to
 * choose the correct header value for the specific option.
 * Example:
 * `header` = ['Yes', 'NO']
 * `options` = ['10 + 10 = 9', 'The world is flat', 'Blue mixed with Yellow is Green'];
 *
 * @example
 * View:
 * +-------------------+-----+----+
 * |                   | Yes | No |
 * +-------------------+-----+----+
 * | 10+10 = 9         | o   | o  |
 * | The world is flat | o   | o  |
 * | 3*4 > 13          | o   | o  |
 * +-------------------+-----+----+
 *
 */
export class MultipleOptions extends Test {

    /**
     * Assign enum value for this category.
     */
    category: Category =  Category.MULTIPLE_OPTIONS;

    /**
     * Header values.
     */
    header: string[];
}
