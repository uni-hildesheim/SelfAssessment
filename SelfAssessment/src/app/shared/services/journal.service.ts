import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { JournalLog } from '../models/state/journal.log.model';
import { JournalStructure } from '../models/state/journal.structure.model';
import { TestSet } from '../models/testspecific/testset.model';
import { Test } from '../models/testspecific/test.model';
import { Infopage } from '../models/testspecific/infopage.model';
import { Journal } from '../models/state/journal.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class JournalService {

  private static readonly SAVE_JOURNAL_LOG = environment.apiUrl + '/api/v1/journal/log/save';
  private static readonly LOAD_JOURNAL_LOG = environment.apiUrl + '/api/v1/journal/load';
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
        journal.structure = this.extractSavedJournalStructure(entry['structure']);
        journal.log = this.extractSavedJournalLog(entry['log']);
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

  extractSavedJournalLog(protoObj) {
    const singleton = new JournalLog();
    singleton.sets = [];
    (protoObj)['sets'].forEach(set => {
      const protoSet = new Map<number, any[]>();
      set['maps'].forEach((obj) => {
        protoSet.set(obj.key, obj.val);
      });
      singleton.sets.push(protoSet);
    });
    return singleton;
  }

  extractSavedJournalStructure(journalStrucRaw) {
    const journalStructure = new JournalStructure();
    journalStructure.sets = [];
    journalStrucRaw['sets'].forEach(setRaw => {
      const set = new TestSet();
      set.id = setRaw.id;
      set.elements = [];
      setRaw['elements'].forEach(element => {
        if (element['setType'] === 'test') {
          set.elements.push(element as Test);
        } else if (element['setType'] === 'infopage') {
          set.elements.push(element as Infopage);
        }
      });
      journalStructure.sets.push(set);
    });

    return journalStructure;
  }
}
