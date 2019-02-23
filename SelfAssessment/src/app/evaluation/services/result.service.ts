import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { tap, map, switchMap } from 'rxjs/operators';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { ResultTest } from 'src/app/shared/models/evaluation/result.test';
import { JournalStructure } from 'src/app/shared/models/state/journal.structure.model';
import { TestSet } from 'src/app/shared/models/procedure/testset.model';
import { ResultSet } from 'src/app/shared/models/evaluation/result.set';
import { Test } from 'src/app/shared/models/procedure/test.model';
import { SetElementType } from 'src/app/shared/models/procedure/enums/element.type.enum';
import { StorageItem } from 'src/app/shared/services/local.storage.values.enum';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  public static readonly LOAD_RESULT = 'api/v1/result/load';

  public static readonly UPDATE_RESULT = 'api/v1/result/update';

  public evaluation: Observable<ResultSet[]>;

  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    private logging: LoggingService
  ) { }

  public initResultServiceFromPin(set: ResultSet[]) {
    this.evaluation = of(set);
  }

  public formatResultSet(data: ResultTest[]): ResultSet[] {
    const mapRawTests = new Map<any, ResultTest>();
    const journalLog = this.storage.retrieveFromStorage(StorageItem.JOURNAL_LOG);
    const structure: JournalStructure = this.storage.retrieveFromStorage(StorageItem.JOURNAL_STRUCTURE);
    const resultSets: ResultSet[] = [];


    data.forEach((rawResultTest: ResultTest) => {
      mapRawTests.set(rawResultTest.id, rawResultTest);
    });

    structure.sets.forEach((set: TestSet, i: number) => {
      const resultSet = new ResultSet();
      resultSet.id = set.id;
      resultSet.tests = [];


      set.elements.forEach(element => {
        if (element.elementType.valueOf() === SetElementType.TEST.valueOf() && (<Test>element).evaluated) {
          mapRawTests.get(element.id.toString()).singleTest = element as Test;
          mapRawTests.get(element.id.toString()).log = journalLog.sets[i].get(element.id);
        }

        if (mapRawTests.has(element.id.toString())) {
          resultSet.tests.push(mapRawTests.get(element.id.toString()));
        }
      });
      resultSets.push(resultSet);
    });
    return resultSets;
  }

  public loadResults(pin): Observable<ResultSet[]> {
    return this.http.post(ResultService.LOAD_RESULT, { pin })
    .pipe(
      map((data: ResultTest[]) => this.formatResultSet(data)),
      tap((set: ResultSet[]) => {
        this.logging.info(`Loaded result set for pin ${pin}`);
        this.logging.debug(undefined, set);
      })
    );
  }

  public getResults(pin): Observable<ResultSet[]> {
    return this.http.post(ResultService.UPDATE_RESULT, {pin}).pipe(
      switchMap(() => {
        return this.loadResults(pin);
      })
    );
  }

}
