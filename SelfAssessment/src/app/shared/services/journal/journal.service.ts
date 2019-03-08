import { JournalStructureMinimal } from '../../models/state/minimal/journal.structure.minimal';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, tap } from 'rxjs/operators';
import { JournalStructure } from '../../models/state/journal.structure.model';
import { Journal } from '../../models/state/journal.model';
import { JournalLog } from '../../models/state/journal.log.model';
import { ConfigService } from '../config.service';
import { Observable, forkJoin } from 'rxjs';
import { ConfigFile } from '../../models/configuration/config.file.model';
import { LoggingService } from '../../logging/logging.service';
import { StorageItem } from '../local.storage.values.enum';
import { JournalDirectorService } from './journal.director';

/**
 * Fetches/Stores journal specific objects from/to the database.
 */
@Injectable({
  providedIn: 'root'
})
export class JournalService {

  /**
   * Api route that loads a journal log.
   */
  public static readonly LOAD_JOURNAL_LOG = 'api/v1/journal/log/load';

  /**
   * Api route that saves a journal log.
   */
  public static readonly SAVE_JOURNAL_LOG = 'api/v1/journal/log/save';

  /**
   * Api route that loads a journal structure.
   */
  public static readonly LOAD_JOURNAL_STRUCTURE = 'api/v1/journal/structure/load';

  /**
   * Api route that saves a journal structure.
   */
  public static readonly SAVE_JOURNAL_STRUCTURE = 'api/v1/journal/structure/save';

  constructor(
    private http: HttpClient,
    private journalDirector: JournalDirectorService,
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
    return this.loadJournalStructure(pin)
    .pipe(
      switchMap((structure: JournalStructure) => {
        return this.loadJournalLog(pin)
        .pipe(
          map((log: JournalLog) => {
            const journal = new Journal;
            journal.log = log;
            journal.structure = structure;
            return journal;
          })
        );
      })
    );
  }

  /**
   * Loads the journal structure object which belongs to a specific pin
   * and uses the config file to create a full journal structure instance instead
   * of a minimal representation.
   *
   * @param pin The pin from the user.
   * @returns An Observable containing the converted journal structure object.
   */
  public loadJournalStructure(pin: number): Observable<JournalStructure> {
    return this.loadMinJournalStructure(pin)
    .pipe(
      switchMap((structure: JournalStructureMinimal) => {
        return this.configService.loadConfigFromCourse(structure.course, structure.language)
        .pipe(
          map((configFile: ConfigFile) => {
            return this.journalDirector.createJournalStructure(configFile, structure);
          })
        );
      })
    );
  }

  /**
   * Loads the raw journal structure object from the backend.
   *
   * @param pin The users pin.
   * @returns An Observable containing the raw journal structure object.
   */
  public loadMinJournalStructure(pin: number): Observable<JournalStructureMinimal> {
    return this.http.post<JournalStructureMinimal>(JournalService.LOAD_JOURNAL_STRUCTURE, {pin})
    .pipe(
      tap((structure) => {
        this.logging.info(`Loaded journal structure for pin: ${pin}`);
        this.logging.debug(structure);
      })
    );
  }

  /**
   * Loads the journal log object from the backend.
   *
   * @param pin The pin from the user.
   * @return An Observable containing the journal log object.
   */
  public loadJournalLog(pin: number): Observable<JournalLog> {
    return this.http.post<JournalLog>(JournalService.LOAD_JOURNAL_LOG, {pin})
    .pipe(
      map((log) => {
        return this.journalDirector.extractSavedJournalLog(log);
      }),
      tap((log) => {
        this.logging.info(`Loaded journal log for pin: ${pin}`);
        this.logging.debug(log);
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
      pin: this.storageService.retrieveFromStorage(StorageItem.PIN),
      log: this.journalDirector.prepareJournalLogForSaving(journalLog)
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

    const pin = this.storageService.retrieveFromStorage(StorageItem.PIN);
    const name = this.storageService.retrieveFromStorage(StorageItem.COURSE).name;
    const langCourse = this.storageService.retrieveFromStorage(StorageItem.COURSE_LANGUAGE);

    return this.http.post(JournalService.SAVE_JOURNAL_STRUCTURE, {
      pin: pin,
      structure: this.journalDirector.prepareJournalStructureForSaving(journalStructure, name, langCourse)
    }).pipe(
      tap(() => {
        this.logging.info('Saved journal structure');
        this.logging.debug(journalStructure);
      })
    );
  }

  public saveJournal(journal: Journal): Observable<any> {
    const storeJournalStruc = this.saveJournalStructure(journal.structure);
    const storeJournalLog = this.saveJournalLog(journal.log);
    return forkJoin([storeJournalStruc, storeJournalLog]);
  }
}
