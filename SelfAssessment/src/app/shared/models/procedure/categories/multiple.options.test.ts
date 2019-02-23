import { Test } from '../test.model';
import { Category } from '../enums/category.enum';

export class MultipleOptions extends Test {
    category: Category =  Category.MULTIPLE_OPTIONS;
    header: string[];
}
