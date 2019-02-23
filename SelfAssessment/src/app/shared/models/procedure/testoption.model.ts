/**
 * An option which is usually a checkbox, a radio-button
 * or some other element.
 */
export interface TestOption {

    /**
     * The text of the option.
     */
    text: string;

    /**
     * Indicates whether the answer is correct.
     */
    correct: boolean | string;
}
