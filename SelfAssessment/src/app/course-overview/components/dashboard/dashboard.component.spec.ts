import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from 'src/app/material/material.module';
import { CourseCardComponent } from '../course-card/course-card.component';
import { HttpClientModule } from '@angular/common/http';
import { GlobalIndicator } from 'src/app/testpanel/global.indicators';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ConfigService } from 'src/app/shared/services/config.service';
import { ConfigFile } from 'src/app/shared/models/config.file.model';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let configServiceStub: any;
  let storageServiceStub: any;

  const mockRouter = {
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };

  const configFile = {
    title: 'IMIT',
    checksumRegex: '',
    tests: [],
    testgroups: [],
    infopages: [],
    sets: []
  };

  const courseTitle = 'IMIT';

  beforeEach(async(() => {

    configServiceStub = {
      getAllCourses: () => of([courseTitle]),
      loadConfigFromCourse: () => {
        return of(configFile);
      }
    };

    storageServiceStub = {
      storeConfigFile: () => true
    };

    TestBed.configureTestingModule({
      imports: [MaterialModule, HttpClientModule
    ],
      declarations: [DashboardComponent, CourseCardComponent],
      providers: [GlobalIndicator,
        {provide: ConfigService, useValue: configServiceStub},
        {provide: LocalStorageService, useValue: storageServiceStub},
        {provide: Router, useValue: mockRouter}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have course list defined from observable', () => {
    component.courses.subscribe(content => {
      const course = content[0] as ConfigFile;
      const compiled = fixture.debugElement.nativeElement;
      expect(course).toBeDefined();
      expect(compiled.querySelector('app-course-card')).not.toBe(null);
    });
  });

  it('should start correct test if button from course card is clicked', () => {

    const spy = spyOn(component, 'startTheTest').and.callThrough();
    const compiled = fixture.debugElement.nativeElement;
    const button = compiled.querySelector('app-course-card button');

    button.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
    expect(spy.calls.all().length).toEqual(1);
    expect(spy).toHaveBeenCalledWith(configFile.title);
    expect(mockRouter.navigateByUrl).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/test-start');

  });



});
