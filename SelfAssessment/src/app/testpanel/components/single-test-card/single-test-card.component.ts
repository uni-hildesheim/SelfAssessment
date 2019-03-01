import { Component, Input, OnChanges, ViewChild } from '@angular/core';
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

  /**
   * The reference to the anchor directive.
   */
  @ViewChild(TestDirective) appTestComponentHost: TestDirective;

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
    const testComponent = ExistingCategories.getNewComponent(this.singleTest.category);

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(testComponent);

    const viewContainerRef = this.appTestComponentHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    const instance = (<CategoryComponent>componentRef.instance);
    instance.test = this.singleTest;
    instance.models = this.journalLogService.getModelByID(this.singleTest.id);

  }





}
