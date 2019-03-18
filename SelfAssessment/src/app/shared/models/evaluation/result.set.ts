import { ResultTest } from './result.test';

/**
 * The evaluated set.
 */
export class ResultSet {

    /**
     * The id of the set instance.
     */
    id: any;

    /**
     * Array containing the results for all the different tests.
     */
    tests: ResultTest[];
}
