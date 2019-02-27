import { ScoreTextPipe } from './../../pipes/score-text.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ResultService } from 'src/app/evaluation/services/result.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Course } from './../../../shared/models/configuration/course.model';
import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { resultSetDummy, dummyJournalStructure } from './../../../spec-helper/dummy.values';
import { JournalStructure } from './../../../shared/models/state/journal.structure.model';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationOverviewComponent } from './evaluation-overview.component';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { Pipe, PipeTransform, Component, Input } from '@angular/core';
import { ResultSet } from 'src/app/shared/models/evaluation/result.set';
import { StorageItem } from 'src/app/shared/services/local.storage.values.enum';
import { of, Observable, throwError } from 'rxjs';
import { OptionPipe } from '../../pipes/option.pipe';
import { ResultPipe } from '../../pipes/result.pipe';


describe('EvaluationOverviewComponent', () => {
  let component: EvaluationOverviewComponent;
  let fixture: ComponentFixture<EvaluationOverviewComponent>;
  let router: Router;
  let storage: LocalStorageService;
  let resultService: ResultService;

  const setDummy: ResultSet[] = resultSetDummy;
  const dummyJournalStruc = dummyJournalStructure;
  const dummyPin = 12345678;
  const dummyCourse: Course = {
    name: 'IMIT',
    languages: [],
    icon: 'imit.jpg'
  };

  const activatedRouteStub = {
    snapshot: {
      paramMap: new Map([['show', true]])
    }
  };



  beforeEach(async(() => {


const strings = {
  'btn-start': 'Start'
};

@Pipe({name: 'language'})
class MockLangPipe implements PipeTransform {
    transform(value: string): string {
        return strings[value];
    }
}




@Component({
  selector: 'app-result-tree',
  template: ''
})
class ResultTreeComponent {
  @Input() tests;
}


    const storageStub = {
      retrieveFromStorage(item: StorageItem) {
        if (item.valueOf() === StorageItem.JOURNAL_STRUCTURE.valueOf()) {
          return dummyJournalStruc;
        } else if (item.valueOf() === StorageItem.COURSE.valueOf()) {
          return dummyCourse;
        } else if (item.valueOf() === StorageItem.PIN.valueOf()) {
          return dummyPin;
        }
      }
    };


    const resultServiceMock = {
      evaluation: of(setDummy),
      getResults(pin): Observable<ResultSet[]> {
        return of(setDummy);
      }
    };

    TestBed.configureTestingModule({
      imports: [MaterialModule, SharedModule, HttpClientModule, RouterTestingModule],
      declarations: [ EvaluationOverviewComponent, ScoreTextPipe, ResultTreeComponent, MockLangPipe, OptionPipe, ResultPipe ],
      providers: [
        {provide: LocalStorageService, useValue: storageStub},
        {provide: ActivatedRoute, useValue: activatedRouteStub},
        {provide: ResultService, useValue: resultServiceMock}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationOverviewComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    storage = TestBed.get(LocalStorageService);
    resultService = TestBed.get(ResultService);
    fixture.detectChanges();
  });

  it('should create with show false', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to validtion', () => {
    spyOn(router, 'navigateByUrl');
    component.goToValidation();
    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('should load the evaluation if it is not present', () => {


    spyOn(component, 'showEval').and.callThrough();
    spyOn(storage, 'retrieveFromStorage').and.callThrough();
    spyOn(resultService, 'getResults').and.callThrough();

    component.showEval();

    // success
    expect(storage.retrieveFromStorage).toHaveBeenCalledWith(StorageItem.PIN);
    expect(resultService.getResults).toHaveBeenCalledWith(dummyPin);

    component.results$.subscribe(
      data => {
        expect(data).toEqual(setDummy);
      }
    );


  });

  it('should throw error loadin the evaluation', () => {

    fixture.detectChanges();

    spyOn(component, 'showEval').and.callThrough();
    spyOn(storage, 'retrieveFromStorage').and.callThrough();
    spyOn(resultService, 'getResults').and.returnValue(throwError({status: 404}));

    component.showEval();

    // error
    expect(storage.retrieveFromStorage).toHaveBeenCalledWith(StorageItem.PIN);
    expect(resultService.getResults).toHaveBeenCalledWith(dummyPin);

    component.results$.subscribe(
      data => {
        expect(data).toEqual([]);
      }
    );

  });


});
