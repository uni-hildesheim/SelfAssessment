import { Course } from '../../../shared/models/configuration/course.model';
import { MaterialOverlayService } from '../../../shared/services/helper/material-overlay.service';
import { Journal } from 'src/app/shared/models/state/journal.model';
import { ConfigFile } from '../../../shared/models/configuration/config.file.model';
import { Observable, of } from 'rxjs';
import { JournalService } from '../../../shared/services/journal/journal.service';
import { CodeService } from 'src/app/shared/services/code.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from './../../../material/material.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartTestComponent } from './start-test.component';
import { PipeTransform, Pipe } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigService } from 'src/app/shared/services/config.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { StorageItem } from 'src/app/shared/services/local.storage.values.enum';

const strings = { };
@Pipe({name: 'language'})
class MockPipe implements PipeTransform {
    transform(value: string): string {
        return strings[value];
    }
}

describe('StartTestComponent', () => {
  let component: StartTestComponent;
  let fixture: ComponentFixture<StartTestComponent>;
  let configService: Partial<ConfigService>;
  let storageService: Partial<LocalStorageService>;
  let journalService: Partial<JournalService>;
  let materialOverlayService: Partial<MaterialOverlayService>;
  let router: Router;

  const dummyConfig: ConfigFile = {
    title: '', icon: '', checksumRegex: '',
    tests: [], testgroups: [], infopages: [],
    sets: []
  };

  const dummyLanguage = 'English';
  const dummyPin = 98364791;
  const dummyJournal: Journal = { log: { sets: [] }, structure: { sets: [] } };
  const dummyCourse: Course = { name: 'IMIT', languages: ['English'] };

  beforeEach(async(() => {

    const mockMaterialOverlayServiceStub = {
      chooseCourseLanguage(data: string[], disableClose: boolean) {
        return of(dummyLanguage);
      }
    };

    const pinServiceStub = {
      createNewPin(): Observable<number> { return of(dummyPin); }
    };



    const journalServiceStub = {
      saveJournal(journal: Journal): Observable<any> { return of('DONE'); }
    };

    const configServiceStub = {
      loadConfigFromCourse(course: string, language: string): Observable<ConfigFile> {
        return of(dummyConfig);
      },
      initJournalFromConfigFile(configFile: ConfigFile): Journal {
        return dummyJournal;
      }
    };

    TestBed.configureTestingModule({
      declarations: [ StartTestComponent, MockPipe ],
      imports: [MaterialModule, HttpClientTestingModule, RouterTestingModule, RouterTestingModule],
      providers: [ LoggingService, LocalStorageService,
        {provide: JournalService, useValue: journalServiceStub},
        {provide: ConfigService, useValue: configServiceStub},
        {provide: CodeService, useValue: pinServiceStub},
        {provide: MaterialOverlayService, useValue: mockMaterialOverlayServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartTestComponent);
    component = fixture.componentInstance;
    storageService = TestBed.get(LocalStorageService);
    configService = TestBed.get(ConfigService);
    journalService = TestBed.get(JournalService);
    router = TestBed.get(Router);
    materialOverlayService = TestBed.get(MaterialOverlayService);

  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get new pin and load course on init', () => {

    const pinService = TestBed.get(CodeService);

    spyOn(component, 'ngOnInit').and.callThrough();
    spyOn(pinService, 'createNewPin').and.callThrough();
    spyOn(storageService, 'retrieveFromStorage').and.returnValue(dummyCourse);

    fixture.detectChanges();

    expect(component.course).toEqual(dummyCourse);
    expect(component.pin).toEqual(dummyPin);
    expect(pinService.createNewPin).toHaveBeenCalled();
    expect(storageService.retrieveFromStorage).toHaveBeenCalledWith(StorageItem.COURSE);

  });


  it('should execute neccessary steps before navigating to testpanel', () => {
    fixture.detectChanges();
    spyOn(materialOverlayService, 'chooseCourseLanguage').and.callThrough();
    spyOn(storageService, 'persistInStorage');
    spyOn(configService, 'loadConfigFromCourse').and.callThrough();
    spyOn(configService, 'initJournalFromConfigFile').and.callThrough();
    spyOn(journalService, 'saveJournal').and.callThrough();
    spyOn(router, 'navigateByUrl');

    component.course = dummyCourse;

    fixture.debugElement.query(By.css('button')).triggerEventHandler('click', null);

    fixture.detectChanges();

    expect(materialOverlayService.chooseCourseLanguage).toHaveBeenCalledWith(dummyCourse.languages, true);
    expect(storageService.persistInStorage).toHaveBeenCalledWith(StorageItem.COURSE_LANGUAGE, 'English');
    expect(configService.loadConfigFromCourse).toHaveBeenCalledWith(dummyCourse.name, dummyLanguage);
    expect(configService.initJournalFromConfigFile).toHaveBeenCalledWith(dummyConfig);
    expect(journalService.saveJournal).toHaveBeenCalledWith(dummyJournal);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/testpanel');
  });


});
