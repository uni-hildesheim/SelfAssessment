import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { JournalStructure } from '../models/state/journal.structure.model';
import { Journal } from '../models/state/journal.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class JournalService {

  private static readonly SAVE_JOURNAL_LOG = environment.apiUrl + '/api/v1/journal/log/save';
  private static readonly LOAD_JOURNAL_LOG = environment.apiUrl + '/api/v1/journal/log/load';
  private static readonly SAVE_JOURNAL_STRUCTURE = environment.apiUrl + '/api/v1/journal/structure/save';

  constructor(
    private http: HttpClient,
    private storageService: LocalStorageService
  ) { }


  loadJournal(pin: number) {
    console.log('LOAD JOURNAL');
    return this.http.post(JournalService.LOAD_JOURNAL_LOG, { pin }).pipe(
      map(entry => {
        const journal = new Journal();
        journal.structure = this.storageService.extractSavedJournalStructure(entry['structure']);
        journal.log = this.storageService.extractSavedJournalLog(entry['log']);
        return journal;
      })
    );
  }

  saveJournalLog(formattedJournalLog: Object) {
    console.log('SAVE JOURNAL LOG');
    return this.http.post(JournalService.SAVE_JOURNAL_LOG, {
      pin: this.storageService.getPin(),
      log: formattedJournalLog
    });
  }

  saveJournalStructure(journalStructure: JournalStructure) {
    console.log('SAVE JOURNAL STRUCTURE');
    return this.http.post(JournalService.SAVE_JOURNAL_STRUCTURE, {
      pin: this.storageService.getPin(),
      structure: journalStructure
    });
  }
}
