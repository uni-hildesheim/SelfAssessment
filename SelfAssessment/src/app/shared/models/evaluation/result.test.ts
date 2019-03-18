import { Test } from '../procedure/test.model';

/**
 * The evaluated single test.
 */
export interface ResultTest {

    /**
     * The id of the corresponding test.
     */
    id: any;

    /**
     * The reached score for this test.
     */
    score: number;

    /**
     * The highest reachable score for this test.
     */
    maxScore: number;

    /**
     * All options that the user correctly checked.
     */
    correctOptions: number[];

    /**
     * All options that the user wrongly checked.
     */
    wrongOptions: number[];

    /**
     * A reference to the actual test instance.
     */
    singleTest: Test;

    /**
     * The log for this test.
     */
    log: any[];
}
