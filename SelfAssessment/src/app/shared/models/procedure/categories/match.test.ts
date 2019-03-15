import { Test } from '../test.model';
import { Category } from '../enums/category.enum';

export class Match extends Test {
    category: Category =  Category.MATCH;
    seconds: number;
}
