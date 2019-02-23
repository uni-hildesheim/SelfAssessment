import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { Test } from 'src/app/shared/models/procedure/test.model';
import { ExistingCategories } from './categories';
import { TestDirective } from './test.directive';
import { ComponentFactoryResolver } from '@angular/core';
import { CategoryComponent } from './categorie.component';
import { JournalLogService } from '../../services/journal-log.service';

/**
 * Component which displays a single test instance.
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
  @ViewChild(TestDirective) appTestComponentHost: TestDirective;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private journalLogService: JournalLogService
  ) { }

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
