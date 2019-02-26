import { LoggingService } from 'src/app/shared/logging/logging.service';
import { StorageItem } from './local.storage.values.enum';
import { Injectable } from '@angular/core';
import { Journal } from '../models/state/journal.model';
import { Router } from '@angular/router';
import { JournalDirectorService } from '../models/state/journal.director';

/**
 * This Service contains the logic for storing/retrieving objects in/from
 * the local stroage and should be the only place where the storage is accessed.
 * It also provides helper methods for other storing use cases.
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(
    private logging: LoggingService,
    private journalDirector: JournalDirectorService,
    private router: Router
  ) { }

  public checkPinInStorage() {
    return localStorage.getItem(StorageItem.PIN);
  }

  public retrieveFromStorage(item: StorageItem): any {
    const result = JSON.parse(localStorage.getItem(item.valueOf()));

    if (!result) {
      // this.clearStorage();
      this.logging.warn(`could not retrieve ${item} from local storage`);
      this.logging.warn(`navigate back to index`);
      this.router.navigateByUrl('/');
    } else {
      // special case for journal log
      if (item.valueOf() === StorageItem.JOURNAL_LOG.valueOf()) {
        return this.journalDirector.extractSavedJournalLog(result);
      } else {
        return result;
      }
    }
  }

  public persistInStorage(item: StorageItem, value: any): any {
    // special case for the journal log because for some reason
    // javascript does not allow maps in the local storage
    if (item.valueOf() === StorageItem.JOURNAL_LOG.valueOf()) {
      localStorage.setItem(item.valueOf(), JSON.stringify(this.journalDirector.prepareJournalLogForSaving(value)));
    } else {
      localStorage.setItem(item.valueOf(), JSON.stringify(value));
    }
  }

  public retrieveJournal(): Journal {
    const journal = new Journal();
    journal.log = this.retrieveFromStorage(StorageItem.JOURNAL_LOG);
    journal.structure = this.retrieveFromStorage(StorageItem.JOURNAL_STRUCTURE);
    return journal;
  }

  public persistJournal(journal: Journal) {
    this.persistInStorage(StorageItem.JOURNAL_LOG, journal.log);
    this.persistInStorage(StorageItem.JOURNAL_STRUCTURE, journal.structure);
  }


  public clearStorage(): void {
    localStorage.clear();
  }

}
