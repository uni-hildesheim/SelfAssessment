import { Test } from '../../testspecific/test.model';

export interface RawResultTest {
    id: any;
    score: number;
    maxScore: number;
    correctOptions: number[];
    wrongOptions: number[];
    singleTest: Test;
    log: any[];
}
