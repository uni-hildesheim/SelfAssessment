// dashboard.po.ts
import {browser, element, by, Key} from 'protractor';

    export class DashboardPage {
        navigateTo() {
            return browser.get('/dashboard');
         }

        isPresentAppPin() {
            return element(by.css('app-pin')).isPresent;
        }

        checkForCourseCard() {
            return element(by.css('app-course-card')).isPresent;
        }

        getCourseCardElements() {
            return element.all(by.css('app-course-card'));
        }

        isPresentSingleCourseCard() {
            return element.all(by.css('app-course-card')).get(0).isPresent();
        }

        getUrl() {
            return browser.getCurrentUrl();
        }

    }
