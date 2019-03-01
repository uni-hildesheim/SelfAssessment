/**
 * A raw set which is used for storage purposes.
 */
export interface TestSetMinimal {

    /***
     * The id of the set.
     */
    set: string;

    /**
     * The ids of the tests which are part of this set.
     */
    tests: string[];
}
