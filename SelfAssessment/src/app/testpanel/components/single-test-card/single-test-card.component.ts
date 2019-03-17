import { Component, Input, OnChanges, ViewChild, ComponentFactory, ViewContainerRef } from '@angular/core';
import { Test } from 'src/app/shared/models/procedure/test.model';
import { ExistingCategories } from './categories';
import { TestDirective } from './test.directive';
import { ComponentFactoryResolver } from '@angular/core';
import { CategoryComponent } from './categorie.component';
import { JournalLogService } from '../../services/journal-log.service';

/**
 * Component which displays a single test instance and dynamicly reloads a new category component
 * instance if the user moves the overall test procedure.
 */
@Component({
  selector: 'app-single-test-card',
  templateUrl: './single-test-card.component.html',
  styleUrls: ['./single-test-card.component.scss']
})
export class SingleTestCardComponent implements OnChanges {

  /**
   * The test which this card displays.
   */
  @Input() singleTest: Test;

  @Input() admin?: boolean;
  @Input() models?: any[];


  /**
   * The reference to the anchor directive.
   */
  @ViewChild(TestDirective) appTestComponentHost: TestDirective;

  /**
   * Provides access to the appTestComponentHosts view to insert the test component.
   */
  public viewContainerRef: ViewContainerRef;

  /**
   * Used to create the specific CategoryComponent.
   */
  public componentFactory: ComponentFactory<CategoryComponent>;

  /**
   * Indicates if the time warning message should be shown.
   */
  public timeWarning: boolean;

  /**
   * Indicates if the countdown clock should be shown.
   */
  public countdownClock: boolean;

  /**
   * Indicates if the component should initally be disabled.
   */
  public componentDisabled: boolean;

  /**
   * @param componentFactoryResolver Gets the components factory.
   * @param journalLogService Loads the components model by id.
   */
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private journalLogService: JournalLogService
  ) { }

  /**
   * Every time the test attribute changes, the component needs to dynamicly reload the content of
   * the appTestComponentHost template to show the current component.
   */
  ngOnChanges() {

    // reset all variables for new test
    this.timeWarning = false;
    this.countdownClock = false;
    this.componentDisabled = this.disableComponent();

    // check if this is a speed test which has not yet been started
    if (this.singleTest.seconds && !this.disableComponent()) {
      this.timeWarning = true;
    }

    // init the componentFactory and the viewContainerRef and clear any previous component
    const testComponent = ExistingCategories.getNewComponent(this.singleTest.category);
    this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(testComponent);
    this.viewContainerRef = this.appTestComponentHost.viewContainerRef;
    this.viewContainerRef.clear();

    // Inject component if one of the two following conditions are true:
    // 1. It is not a speed test
    // 2. It is a speed test that has already been executed once
    // otherwise wait for the user to click the start button to inject the component
    if (!this.singleTest.seconds ||
      (this.singleTest.seconds && this.disableComponent())) {
      this.injectComponent();
    }
  }

  /**
   * Injects the specific category component into the appTestComponentHost and
   * sets the test and model.
   */
  public injectComponent(): void {
    const componentRef = this.viewContainerRef.createComponent(this.componentFactory);
    const instance = (<CategoryComponent>componentRef.instance);
    instance.test = this.singleTest;

    if (!this.admin) {
      instance.models = this.journalLogService.getModelByID(this.singleTest.id);
    } else {
      instance.models = this.models;
      instance.admin = true;
    }
  }

  /**
   * Starts the task for a speedtest by setting the appropriate variables and
   * initalizing the model, to prevent editing an already done speedtest.
   */
  public startTask(): void {
    this.countdownClock = true;
    this.timeWarning = false;

    if (this.singleTest.seconds &&
      (this.checkModel(this.journalLogService.getModelByID(this.singleTest.id)))) {
      this.fillModel(false,
        this.journalLogService
          .getModelByID(this.singleTest.id));


      this.injectComponent();
    }
  }

  /**
   * After a countdown ends this methods ends the speedtest, by removing the countdown
   * clock, disabling the component and refreshing the journal log.
   */
  public endTask(): void {
    this.countdownClock = false;
    this.componentDisabled = true;
    this.journalLogService.refreshJournalLog();
  }

  /**
   * Checks whether this component should be disabled.
   * Only disable if this is a speed test which has already been answered.
   * @returns Boolean indicating if this component should be disabled.
   */
  public disableComponent(): boolean {
    if (this.singleTest.seconds &&
      (!this.checkModel(this.journalLogService.getModelByID(this.singleTest.id)))) {
      return true;
    }
    return false;
  }

  public checkModel(elem): boolean {
    const result = true;
    if (Array.isArray(elem)) {
      let subResult = true;
      for (const subElem of elem) {
        subResult = subResult && this.checkModel(subElem);
      }
      return result && subResult;
    } else {
      return result && elem === null;
    }
  }

  public fillModel(val, arr) {
    if (Array.isArray(arr[0])) {
      for (const elem of arr) {
        this.fillModel(val, elem);
      }
    } else {
      arr.fill(val);
    }
  }

}
