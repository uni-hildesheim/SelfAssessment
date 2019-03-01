/**
 * Contains the users progress across multiple sets.
 * Every time the user finishes a test question an updated version is send to the backend.
 * The log is used to keep track of already answered questions, so that the user can move
 * foward/backward without losing the answers.
 * In Conjunction with the [JournalStructure]{@link JournalStructure} the log can be used to restore
 * the applications state, if the user decides to continue the test procedure another time.
 */
export class JournalLog {

    /**
     * Contains the answers for every test in every set.
     * The key (the id of the set) is assigned to an array
     * which contains the test answers.
     */
    sets: Map<string, any[]>[];
}
