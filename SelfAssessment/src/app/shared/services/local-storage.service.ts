import { LoggingService } from 'src/app/shared/logging/logging.service';
import { StorageItem } from './local.storage.values.enum';
import { Injectable } from '@angular/core';
import { Journal } from '../models/state/journal.model';
import { Router } from '@angular/router';
import { JournalDirectorService } from './journal/journal.director';

/**
 * This Service contains the logic for storing/retrieving objects in/from
 * the local stroage and should be the only place where the storage is accessed.
 * It also provides helper methods for other storing use cases.
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  /**
   * Constructor for the storage service.
   */
  constructor(
    private logging: LoggingService,
    private journalDirector: JournalDirectorService,
    private router: Router
  ) { }

  /**
   * Method which checks if the storage contains a pin.
   */
  public checkPinInStorage(): any {
    return localStorage.getItem(StorageItem.PIN);
  }

  /**
   * Retrieves a specific item from the local storage.
   *
   * @param item Item to retrieve.
   * @returns The parsed item.
   */
  public retrieveFromStorage(item: StorageItem): any {
    let result;
    try {
      result = JSON.parse(localStorage.getItem(item.valueOf()));
    } catch (e) {
      result = undefined;
    }

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

  /**
   * Persists a specific item in the local storage.
   *
   * @param item The type of item to persist.
   * @param value The actual item.
   */
  public persistInStorage(item: StorageItem, value: any): any {
    // special case for the journal log because for some reason
    // javascript does not allow maps in the local storage
    if (item.valueOf() === StorageItem.JOURNAL_LOG.valueOf()) {
      localStorage.setItem(item.valueOf(), JSON.stringify(this.journalDirector.prepareJournalLogForSaving(value)));
    } else {
      localStorage.setItem(item.valueOf(), JSON.stringify(value));
    }
  }

  /**
   * Retrieves the journal from the local storage.
   * @returns The journal.
   */
  public retrieveJournal(): Journal {
    const journal = new Journal();
    journal.log = this.retrieveFromStorage(StorageItem.JOURNAL_LOG);
    journal.structure = this.retrieveFromStorage(StorageItem.JOURNAL_STRUCTURE);
    return journal;
  }

  /**
   * Persists the journal in the local storage.
   * @param journal The journal instance.
   */
  public persistJournal(journal: Journal): void {
    this.persistInStorage(StorageItem.JOURNAL_LOG, journal.log);
    this.persistInStorage(StorageItem.JOURNAL_STRUCTURE, journal.structure);
  }

  /**
   * Clears all the items stored in the local storage.
   */
  public clearStorage(): void {
    const keys = Object.keys(localStorage);
    let i = keys.length - 1;
    while (i >= 0) {
      if (keys[i] !== StorageItem.RESOURCES && keys[i] !== StorageItem.LANGUAGE) {
        localStorage.removeItem(keys[i]);
      }
      i--;
    }
  }

}
