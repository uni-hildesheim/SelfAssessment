import { Test } from '../test.model';
import { Category } from '../enums/category.enum';

export class Speed extends Test {
    category: Category =  Category.SPEED;
    seconds: number;
}
