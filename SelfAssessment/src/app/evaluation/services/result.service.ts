import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { tap, map, switchMap } from 'rxjs/operators';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { ResultTest } from 'src/app/shared/models/evaluation/result.test';
import { JournalStructure } from 'src/app/shared/models/state/journal.structure.model';
import { ResultSet } from 'src/app/shared/models/evaluation/result.set';
import { Test } from 'src/app/shared/models/procedure/test.model';
import { SetElementType } from 'src/app/shared/models/procedure/enums/element.type.enum';
import { StorageItem } from 'src/app/shared/services/local.storage.values.enum';
import { JournalLog } from 'src/app/shared/models/state/journal.log.model';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  /**
   * Api route for loading the results.
   */
  public static readonly LOAD_RESULT = 'api/v1/result/load';

  /**
   * Api route for updating (getting) the results.
   */
  public static readonly UPDATE_RESULT = 'api/v1/result/update';

  /**
   * Helper observable, used if user wants to revisit the results.
   */
  public evaluation: Observable<ResultSet[]>;

  /**
   * Constructor for this service.
   */
  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    private logging: LoggingService
  ) { }

  /**
   * Initalizes the result set from an already loaded result set, when the user provided the pin.
   * @param set The loaded set.
   */
  public initResultServiceFromPin(set: ResultSet[]) {
    this.evaluation = of(set);
  }

  /**
   * Formats a raw result set from the backend.
   * @param data The raw data.
   * @returns The formatted result sets.
   */
  public formatResultSet(data): ResultSet[] {
    const journalLog: JournalLog = this.storage.retrieveFromStorage(StorageItem.JOURNAL_LOG);
    const structure: JournalStructure = this.storage.retrieveFromStorage(StorageItem.JOURNAL_STRUCTURE);

    // workaround for bug: filtering out the unevaluated sets messes up the order
    // of the journal log instance, so that the journal log is undefined for some tests
    const flatJournalLog = new Map();
    for (const logMap of journalLog.sets) {
      logMap.forEach((v, k) => {
        flatJournalLog.set(k, v);
      });
    }


    const resultSets: ResultSet[] =
    structure.sets
    // ignore all sets that only have unevaluated tests
    .filter(set => set.elements.filter(e => e.elementType.valueOf() === SetElementType.TEST.valueOf() && (<Test>e).evaluated).length > 0)
    .map(set => {
      const resultSet: ResultSet = {id: set.id, tests: []};
      resultSet.tests = set.elements
      // ignore all tests that are unevaluated
      .filter(e => e.elementType.valueOf() === SetElementType.TEST.valueOf() && (<Test>e).evaluated)
      .map(e => {
        const resultTest: ResultTest = data.find(t => e.id.toString() === t.id) as ResultTest;
        resultTest.singleTest = e as Test;
        resultTest.log = flatJournalLog.get(e.id);
        return resultTest;
      });
      return resultSet;
    });
    return resultSets;
  }

  /**
   * Loads the results from the backend, after they have been updated.
   */
  public loadResults(pin): Observable<ResultSet[]> {
    return this.http.post(ResultService.LOAD_RESULT, { pin })
    .pipe(
      map(data => this.formatResultSet(data)),
      tap((set: ResultSet[]) => {
        this.logging.info(`Loaded result set for pin ${pin}`);
        this.logging.debug(set);
      })
    );
  }

  /**
   * Updates the results in the backend and then switches to loading them.
   */
  public getResults(pin): Observable<ResultSet[]> {
    return this.http.post(ResultService.UPDATE_RESULT, {pin}).pipe(
      switchMap(() => {
        return this.loadResults(pin);
      })
    );
  }

}
