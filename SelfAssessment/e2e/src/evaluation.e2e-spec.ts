import { EvaluationPage } from './pages/evaluation.po';
/**
 * This testfile shows the tests for the evaluation page without a specific config file.
 */
xdescribe('Evaluation View', function() {
        let page: EvaluationPage;

        beforeEach(() => {
            page = new EvaluationPage();
            page.navigateTo();
        });
        it('should have a mat-card', () => {
            expect(page.isPresentMatCard()).toBe(true);
        });
});
