import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { tap, map, switchMap } from 'rxjs/operators';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { RawResultTest } from 'src/app/shared/models/evaluation/raw/raw.result.test';
import { JournalStructure } from 'src/app/shared/models/state/journal.structure.model';
import { TestSet } from 'src/app/shared/models/testspecific/testset.model';
import { ResultSet } from 'src/app/shared/models/evaluation/result.set';
import { Test } from 'src/app/shared/models/testspecific/test.model';

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

  public formatResultSet(data: RawResultTest[]): ResultSet[] {
    const mapRawTests = new Map<any, RawResultTest>();
    const journalLog = this.storage.getJournalLog();
    const structure: JournalStructure = this.storage.getJournalStructure();
    const resultSets: ResultSet[] = [];


    data.forEach((rawResultTest: RawResultTest) => {
      mapRawTests.set(rawResultTest.id, rawResultTest);
    });

    structure.sets.forEach((set: TestSet, i: number) => {
      const resultSet = new ResultSet();
      resultSet.id = set.id;
      resultSet.tests = [];


      set.elements.forEach(element => {
        if (element.setType === 'test' && (<Test>element).evaluated) {
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
      map((data: RawResultTest[]) => this.formatResultSet(data)),
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
