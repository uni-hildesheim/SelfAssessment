import { SetElement } from './set.element.model';

/**
 * Page that offers help for solving a test/testgroup.
 */
export class Infopage implements SetElement {
    id: number;
    text: string;
    belongs: number;
    setType = 'infopage';
}
