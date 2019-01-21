import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseOverviewRoutingModule } from './course-overview-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CourseCardComponent } from './components/course-card/course-card.component';
import { MaterialModule } from '../material/material.module';
import { StartTestComponent } from './components/start-test/start-test.component';

@NgModule({
  declarations: [DashboardComponent, CourseCardComponent, StartTestComponent],
  imports: [
    CommonModule,
    CourseOverviewRoutingModule,
    MaterialModule
  ],
  exports: [
    DashboardComponent,
    StartTestComponent
  ]
})
export class CourseOverviewModule { }
