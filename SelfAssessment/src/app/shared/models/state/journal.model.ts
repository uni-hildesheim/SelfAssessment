import { JournalLog } from './journal.log.model';
import { JournalStructure } from './journal.structure.model';

/**
 * Main class for managing the application setup and state.
 * For every user an individual instance is created and
 * stored in the backend.
 */
export class Journal {

    /**
     * The log containing the users progress.
     */
    log: JournalLog;

    /**
     *  The individual application structure.
     */
    structure: JournalStructure;
}

