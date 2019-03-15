import { Injectable } from '@angular/core';
import { GlobalIndicator } from '../global.indicators';
import { JournalStructure } from 'src/app/shared/models/state/journal.structure.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { JournalLog } from 'src/app/shared/models/state/journal.log.model';
import { SetElement } from 'src/app/shared/models/procedure/set.element.model';
import { Test } from 'src/app/shared/models/procedure/test.model';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { SetElementType } from 'src/app/shared/models/procedure/enums/element.type.enum';
import { Category } from 'src/app/shared/models/procedure/enums/category.enum';
import { MultipleOptions } from 'src/app/shared/models/procedure/categories/multiple.options.test';
import { StorageItem } from 'src/app/shared/services/local.storage.values.enum';

/**
 * Keeps track of the journal log across the application.
 */
@Injectable({
  providedIn: 'root'
})
export class JournalLogService {

  /**
   * Observable that contains the instance of the journal log.
   * Every Observer that is subscribed to this object, receives
   * notifications when the journal log instances changes.
   */
  public journalLog: BehaviorSubject<JournalLog>;

  constructor(
    private globals: GlobalIndicator,
    private storageService: LocalStorageService,
    private logging: LoggingService
  ) { }

  /**
   * The model is returned by this method is a pivotal element
   * in sustaining the state across the application. It returns
   * the model for the test specific element e.g the checkbox,
   * the radio-buttons or the strings for the match test.
   *
   * @param id The id of the single test.
   * @returns The test specific model.
   */
  public getModelByID(id: string): any {
    return this.journalLogInstance.sets[this.globals.setIndex].get(id);
  }


  public initJournalLog(journalLog: JournalLog): void {
    this.journalLog = new BehaviorSubject(journalLog);
  }


  /**
   * Retrieves the observable from this behaviour subject.
   *
   * @returns The observable containing the journal log.
   */
  public getJournalLogAsObservable(): Observable<JournalLog> {
    if (!this.journalLog) {
      this.journalLog = new BehaviorSubject(this.storageService.retrieveFromStorage(StorageItem.JOURNAL_LOG));
    }
    return this.journalLog.asObservable();
  }

  /**
   * Called after the journal log was updated.
   * Notifies the observers which are subscribed to the journal log behaviour subject.
   */
  public refreshJournalLog(): void {
    this.storageService.persistInStorage(StorageItem.JOURNAL_LOG, this.journalLogInstance);
    this.journalLog.next(this.journalLogInstance);
  }

  /**
   * Getter for the actual journal log instance inside the journal log
   * behaviour subject.
   *
   * @returns The journal log instance.
   */
  get journalLogInstance(): JournalLog {
    return this.journalLog.getValue();
  }

}
