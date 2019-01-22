import { Injectable } from '@angular/core';
import { GlobalIndicator } from '../global.indicators';
import { JournalStructure } from 'src/app/shared/models/state/journal.structure.model';
import { BehaviorSubject } from 'rxjs';
import { JournalLog } from 'src/app/shared/models/state/journal.log.model';
import { SetElement } from 'src/app/shared/models/testspecific/set.element.model';
import { Test } from 'src/app/shared/models/testspecific/test.model';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class JournalLogService {

  public journalLog: BehaviorSubject<JournalLog>;

  constructor(
    private globals: GlobalIndicator,
    private storageService: LocalStorageService
  ) { }

  getModelByID(id: number) {
    return this.journalLogInstance.sets[this.globals.setIndex].get(id);
  }

  initJournalLogFromPin(journalLog: JournalLog) {
    this.journalLog = new BehaviorSubject(journalLog);
  }

  initJournalLog(journalStruc: JournalStructure): JournalLog {
    const sets = journalStruc.sets;
    console.log('INIT JOURNAL LOG FROM JOURNAL STRUCTURE');

    const journalLog = new JournalLog();
    journalLog.sets = [];

    // each set has its own map with its single tests
    sets.forEach(set => {
      const journalSet = new Map<number, any[]>();

      // extract all the single tests from the set, at this point
      // it does not matter if a test belongs to a testgroup
      set.elements.forEach((element: SetElement) => {
        if (element.setType === 'test') {
          if ((<Test>element).category !== 'multiple-options') {
            journalSet.set(element.id, new Array((<Test>element).options.length).fill(false));
          } else {
            const temp = new Array((<Test>element).options.length);
            for (let i = 0; i < temp.length; i++) {
              temp[i] = new Array((<Test>element).header.length).fill(false);
            }
            journalSet.set(element.id, temp);
          }
        }
      });
      journalLog.sets.push(journalSet);
    });
    // init the observable
    this.journalLog = new BehaviorSubject(journalLog);
    return journalLog;
  }

  getJournalLogAsObservable() {
    if (!this.journalLog) {
      this.journalLog = new BehaviorSubject(this.storageService.getJournalLog());
    }
    return this.journalLog.asObservable();
  }

  refreshJournalLog() {
    this.storageService.storeJournalLog(this.journalLogInstance);
    this.journalLog.next(this.journalLogInstance);
  }

  get journalLogInstance() {
    return this.journalLog.getValue();
  }

}
