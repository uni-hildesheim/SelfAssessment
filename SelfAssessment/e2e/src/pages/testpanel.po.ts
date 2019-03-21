import {browser, element, by} from 'protractor';

    export class TestpanelPage {
        navigateTo() {
            return browser.get('/testpanel');
        }

        isPresentMatStep() {
            return element(by.css('mat-step')).isPresent();
        }
        isPresentButtons() {
            return element(by.css('button')).isPresent();
        }
        getAllButtons() {
            return element.all(by.css('button'));
        }

        isPresentMatIcon() {
            return element(by.css('mat-icon')).isPresent();
        }

        getAllMatIcon() {
            return element.all(by.css('mat-icon'));
        }

        isPresentMatProgressBar() {
            return element(by.css('mat-progress-bar')).isPresent();
        }

        getAllMatProgressBar() {
            return element.all(by.css('mat-progress-bar'));
        }
    }
