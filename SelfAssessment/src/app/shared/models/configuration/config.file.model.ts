/**
 * This class models the config file for a specific course.
 * It contains the raw information which was written inside
 * the course definition file.
 */
export class ConfigFile {

    /**
     * The title of the course.
     */
    title: string;

    /**
     * The name of the image icon.
     */
    icon: string;

    /**
     * The checksum regex.
     */
    checksumRegex: string;

    /**
     * All the single tests.
     */
    tests: any[];

    /**
     * All the testgroups.
     */
    testgroups: any[];

    /**
     * All the infopages.
     */
    infopages: any[];

    /**
     * The setup of the actual test sets.
     */
    sets: any[];
}
