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
import { JournalLog } from 'src/app/shared/models/state/journal.log.model';
import { SetElement } from 'src/app/shared/models/procedure/set.element.model';

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

  public formatResultSet(data): ResultSet[] {
    const journalLog: JournalLog = this.storage.retrieveFromStorage(StorageItem.JOURNAL_LOG);
    const structure: JournalStructure = this.storage.retrieveFromStorage(StorageItem.JOURNAL_STRUCTURE);

    const resultSets: ResultSet[] =
    structure.sets
    .map((set, i) => {
      const resultSet: ResultSet = {id: set.id, tests: []};
      resultSet.tests = set.elements
      .filter(e => e.elementType.valueOf() === SetElementType.TEST.valueOf() && (<Test>e).evaluated)
      .map(e => {
        const resultTest: ResultTest = data.find(t => e.id.toString() === t.id) as ResultTest;
        resultTest.singleTest = e as Test;
        resultTest.log = journalLog.sets[i].get(e.id);
        return resultTest;
      });
      return resultSet;
    });
    return resultSets;
  }

  public loadResults(pin): Observable<ResultSet[]> {
    return this.http.post(ResultService.LOAD_RESULT, { pin })
    .pipe(
      map(data => this.formatResultSet(data)),
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
