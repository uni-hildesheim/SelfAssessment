import { Test } from 'src/app/shared/models/procedure/test.model';

/**
 * This Component needs to implemented by all the different types of category components.
 * An instance of this Component is loaded at runtime by the
 * [SingleTestCardComponent]{@link SingleTestCardComponent}.
 * It provides the generic attributes which every test categorie component needs to have.
 */
export interface CategoryComponent {

    /**
     * The test which the component displays.
     */
    test: Test;

    /**
     * The array containing the models of the test.
     */
    models: any[];

    admin?: boolean;

    /**
     *
     * Every category component implements this method to handle changes to the model array.
     * For every category the model array can contain different types of variables and changes so
     * that changes to the model needs to be handled by the specific component.
     *
     * @param value The value which indicates the change.
     * @param i The index at the model.
     * @param j An optional index if the model is multidimensional.
     */
    handleModelChange(value: any, i: number, j?: number);
}
