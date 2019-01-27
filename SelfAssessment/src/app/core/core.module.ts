import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryComponent } from './components/entry/entry.component';
import { TestpanelModule } from '../testpanel/testpanel.module';
import { CourseOverviewModule } from '../course-overview/course-overview.module';
import { AppRoutingModule } from '../app-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './interceptor/http-error.interceptor';

@NgModule({
  declarations: [EntryComponent, NavbarComponent],
  imports: [
    CommonModule,
    TestpanelModule,
    CourseOverviewModule,
    AppRoutingModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    EntryComponent
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
     useClass: HttpErrorInterceptor,
     multi: true
  }]
})
export class CoreModule { }
