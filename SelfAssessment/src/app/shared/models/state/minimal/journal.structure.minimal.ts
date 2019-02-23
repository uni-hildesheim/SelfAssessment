import { TestSetMinimal } from './test.set.minimal';

/**
 * A minimal representation of a journal structure which contains
 * all the necessary information to recreate the same journal structure
 * in conjunction with the specific config file.
 * Used to store a journal structure object in the database.
 */
export interface JournalStructureMinimal {

    /**
     *  The course of this journal structure.
     */
    course: string;

    /**
     * The desired language.
     */
    language: string;

    /**
     * The minimal representation of the structure sets.
     */
    sets: TestSetMinimal[];
}
