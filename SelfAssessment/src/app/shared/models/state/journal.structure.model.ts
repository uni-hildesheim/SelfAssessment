import { TestSet } from '../testspecific/testset.model';

/**
 * Holds the actual structure of the testpanel.
 * Structure means the sequence of SetElements, which
 * can be single tests or infopages.
 * Since this structure is (potentially) different for
 * every user it has to be stored alongside the JournalLog.
 */
export class JournalStructure {

    /**
     * Contains the individual TestSet information for
     * every set.
     */
    sets: TestSet[];
}
