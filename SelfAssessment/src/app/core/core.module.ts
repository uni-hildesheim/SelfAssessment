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
import { HttpLoggingInterceptor } from './interceptor/http-logging.interceptor';
import { HttpApiInterceptor } from './interceptor/http-api.interceptor';
import { EvaluationModule } from '../evaluation/evaluation.module';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [EntryComponent, NavbarComponent, FooterComponent],
  imports: [
    CommonModule,
    TestpanelModule,
    CourseOverviewModule,
    AppRoutingModule,
    MaterialModule,
    SharedModule,
    EvaluationModule
  ],
  exports: [
    EntryComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpApiInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoggingInterceptor,
      multi: true
    }]
})
export class CoreModule { }
