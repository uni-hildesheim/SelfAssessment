import { Test } from '../test.model';
import { Category } from '../enums/category.enum';


export class MultipleChoice extends Test {
    category: Category =  Category.MULTIPLE_CHOICE;
}
