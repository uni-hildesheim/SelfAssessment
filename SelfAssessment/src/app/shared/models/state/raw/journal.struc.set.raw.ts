/**
 * A raw set which is used for storage purposes.
 */
export interface SetRaw {

    /***
     * The id of the set.
     */
    set: number;

    /**
     * The ids of the tests which are part of this set.
     */
    tests: number[];
}
