import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { JournalStructure } from '../models/state/journal.structure.model';
import { Journal } from '../models/state/journal.model';
import { LocalStorageService } from './local-storage.service';
import { JournalLog } from '../models/state/journal.log.model';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { ConfigFile } from '../models/config.file.model';
import { LoggingService } from '../logging/logging.service';

@Injectable({
  providedIn: 'root'
})
export class JournalService {

  public static readonly SAVE_JOURNAL_LOG = 'api/v1/journal/log/save';
  public static readonly LOAD_JOURNAL = 'api/v1/journal/load';
  public static readonly SAVE_JOURNAL_STRUCTURE = 'api/v1/journal/structure/save';

  constructor(
    private http: HttpClient,
    private storageService: LocalStorageService,
    private configService: ConfigService,
    private logging: LoggingService
  ) { }


  loadJournal(pin: number): Observable<Journal> {
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

  saveJournalLog(journalLog: JournalLog) {
    return this.http.post(JournalService.SAVE_JOURNAL_LOG, {
      pin: this.storageService.getPin(),
      log: this.storageService.prepareJournalLogForSaving(journalLog)
    }).pipe(
      tap(() => {
        this.logging.info('Saved journal log');
      })
    );
  }

  saveJournalStructure(journalStructure: JournalStructure) {
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
