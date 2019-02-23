import { Test } from 'src/app/shared/models/procedure/test.model';

export interface CategoryComponent {
    test: Test;
    models: any[];
    handleModelChange(value: any, i: number, j?: number);
}
