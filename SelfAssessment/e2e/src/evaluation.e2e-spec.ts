import { EvaluationPage } from './pages/evaluation.po';

describe('Evaluation View', function() {
        let page: EvaluationPage;

        beforeEach(() => {
            page = new EvaluationPage();
            page.navigateTo();
        });

        it('should have a mat-card', () => {
            expect(page.isPresentMatCard()).toBe(true);
        });


});
