import { StorageItem } from './../../../shared/services/local.storage.values.enum';
import { Course } from 'src/app/shared/models/configuration/course.model';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from 'src/app/material/material.module';
import { CourseCardComponent } from '../course-card/course-card.component';
import { HttpClientModule } from '@angular/common/http';
import { GlobalIndicator } from 'src/app/testpanel/global.indicators';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ConfigService } from 'src/app/shared/services/config.service';
import { of } from 'rxjs';
import { PinComponent } from '../pin/pin.component';
import { Pipe, PipeTransform } from '@angular/core';

const strings = { };

@Pipe({name: 'language'})
class MockPipe implements PipeTransform {
    transform(value: string): string {
        return strings[value];
    }
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let router: Router;
  let storageService: Partial<LocalStorageService>;
  let configService: Partial<ConfigService>;

  const mockCourse: Course = {
    name: 'IMIT',
    languages: ['English'],
  };

  beforeEach(async(() => {

    const ConfigServiceStub = {
      getAllCourses() { return of([mockCourse]); }
    };

    TestBed.configureTestingModule({
      imports: [MaterialModule, HttpClientModule, RouterTestingModule
    ],
      declarations: [DashboardComponent, CourseCardComponent, PinComponent, MockPipe],
      providers: [GlobalIndicator, LocalStorageService,
        {provide: ConfigService, useValue: ConfigServiceStub}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    storageService = TestBed.get(LocalStorageService);
    configService = TestBed.get(ConfigService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should have course list defined from observable', () => {
    component.courses.subscribe(course => {
      expect(course[0]).toBeDefined();
      expect(course[0]).toEqual(mockCourse);
    });
  });

  it('should start correct test if button from course card is clicked', () => {

    spyOn(component, 'startTheTest').and.callThrough();
    spyOn(storageService, 'persistInStorage');
    spyOn(router, 'navigate');

    component.startTheTest(mockCourse);

    expect(component.startTheTest).toHaveBeenCalledWith(mockCourse);
    expect(storageService.persistInStorage).toHaveBeenCalledWith(StorageItem.COURSE, mockCourse);
    expect(router.navigate).toHaveBeenCalledWith(['/test-start', mockCourse]);
  });
});
