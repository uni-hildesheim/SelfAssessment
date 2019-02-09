import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CourseCardComponent } from './components/course-card/course-card.component';
import { MaterialModule } from '../material/material.module';
import { StartTestComponent } from './components/start-test/start-test.component';
import { SharedModule } from '../shared/shared.module';
import { PinComponent } from './components/pin/pin.component';

@NgModule({
  declarations: [DashboardComponent, CourseCardComponent, StartTestComponent, PinComponent],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    DashboardComponent,
    StartTestComponent
  ]
})
export class CourseOverviewModule { }
