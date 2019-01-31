import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { JournalStructure } from '../models/state/journal.structure.model';
import { Journal } from '../models/state/journal.model';
import { LocalStorageService } from './local-storage.service';
import { JournalLog } from '../models/state/journal.log.model';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { ConfigFile } from '../models/config.file.model';

@Injectable({
  providedIn: 'root'
})
export class JournalService {

  private static readonly SAVE_JOURNAL_LOG = environment.apiUrl + '/api/v1/journal/log/save';
  private static readonly LOAD_JOURNAL = environment.apiUrl + '/api/v1/journal/load';
  private static readonly SAVE_JOURNAL_STRUCTURE = environment.apiUrl + '/api/v1/journal/structure/save';

  constructor(
    private http: HttpClient,
    private storageService: LocalStorageService,
    private configService: ConfigService
  ) { }


  loadJournal(pin: number): Observable<Journal> {
    console.log('LOAD JOURNAL');
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
              })
            );
        })
      );
  }

  saveJournalLog(journalLog: JournalLog) {
    console.log('SAVE JOURNAL LOG');
    return this.http.post(JournalService.SAVE_JOURNAL_LOG, {
      pin: this.storageService.getPin(),
      log: this.storageService.prepareJournalLogForSaving(journalLog)
    });
  }

  saveJournalStructure(journalStructure: JournalStructure) {
    console.log('SAVE JOURNAL STRUCTURE');
    return this.http.post(JournalService.SAVE_JOURNAL_STRUCTURE, {
      pin: this.storageService.getPin(),
      structure: this.storageService.prepareJournalStructureForSaving(journalStructure)
    });
  }
}
