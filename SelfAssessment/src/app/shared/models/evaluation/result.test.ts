import { Test } from '../procedure/test.model';

export interface ResultTest {
    id: any;
    score: number;
    maxScore: number;
    correctOptions: number[];
    wrongOptions: number[];
    singleTest: Test;
    log: any[];
}
