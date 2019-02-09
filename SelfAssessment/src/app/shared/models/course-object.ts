
/**
 * A course representation without the definition information.
 */
export interface Course {

    /**
     * The name of the Course.
     */
    name: string;

    /**
     * The name of the image icon.
     */
    icon?: string;

    /**
     * Possible languages for this course.
     */
    languages: string[];
}
