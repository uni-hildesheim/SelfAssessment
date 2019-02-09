import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, tap } from 'rxjs/operators';
import { JournalStructure } from '../models/state/journal.structure.model';
import { Journal } from '../models/state/journal.model';
import { LocalStorageService } from './local-storage.service';
import { JournalLog } from '../models/state/journal.log.model';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { ConfigFile } from '../models/config.file.model';
import { LoggingService } from '../logging/logging.service';

/**
 * Fetches/Stores journal specific objects from/to the database.
 */
@Injectable({
  providedIn: 'root'
})
export class JournalService {

  /**
   * Api route that saves a journal log instance.
   */
  public static readonly SAVE_JOURNAL_LOG = 'api/v1/journal/log/save';

  /**
   * Api route that loads a journal.
   */
  public static readonly LOAD_JOURNAL = 'api/v1/journal/load';

  /**
   * Api route that saves a journal structure instance.
   */
  public static readonly SAVE_JOURNAL_STRUCTURE = 'api/v1/journal/structure/save';

  constructor(
    private http: HttpClient,
    private storageService: LocalStorageService,
    private configService: ConfigService,
    private logging: LoggingService
  ) { }

  /**
   * Fetches the user specific journal from the database.
   *
   * @param pin The pin from the user.
   * @returns Observable containing the journal.
   */
  public loadJournal(pin: number): Observable<Journal> {
    return this.http.post(JournalService.LOAD_JOURNAL, { pin })
      .pipe(
        switchMap(entry => {
          return this.configService.loadConfigFromCourse(entry['structure'].course)
            .pipe(
              map((configFile: ConfigFile) => {
                const journal = new Journal();
                journal.structure = this.storageService.createJournalStructure(configFile, entry['structure']);
                journal.log = this.storageService.extractSavedJournalLog(entry['log']);
                return journal;
              }),
              tap((data) => {
                this.logging.info(`Loaded journal for pin: ${pin}`);
                this.logging.debug(undefined, data);
              })
            );
        })
      );
  }

  /**
   * Stores the journal log in the database.
   *
   * @param formattedJournalLog The prepared journal log.
   * @returns Observable.
   */
  public saveJournalLog(journalLog: JournalLog): Observable<any> {
    return this.http.post(JournalService.SAVE_JOURNAL_LOG, {
      pin: this.storageService.getPin(),
      log: this.storageService.prepareJournalLogForSaving(journalLog)
    }).pipe(
      tap(() => {
        this.logging.info('Saved journal log');
      })
    );
  }

  /**
   * Stores the journal structure in the database.
   *
   * @param journalStructure The log structure.
   * @returns Observable.
   */
  public saveJournalStructure(journalStructure: JournalStructure): Observable<any> {
    return this.http.post(JournalService.SAVE_JOURNAL_STRUCTURE, {
      pin: this.storageService.getPin(),
      structure: this.storageService.prepareJournalStructureForSaving(journalStructure)
    }).pipe(
      tap(() => {
        this.logging.info('Saved journal structure');
        this.logging.debug(undefined, journalStructure);
      })
    );
  }
}
