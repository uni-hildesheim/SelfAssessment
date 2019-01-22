import { Injectable } from '@angular/core';
import { JournalLog } from '../models/state/journal.log.model';
import { Journal } from '../models/state/journal.model';
import { JournalStructure } from '../models/state/journal.structure.model';
import { TestSet } from '../models/testspecific/testset.model';
import { Test } from '../models/testspecific/test.model';
import { Infopage } from '../models/testspecific/infopage.model';
import { ConfigFile } from '../models/config.file.model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  storeJournal(journal: Journal) {
    localStorage.setItem('journallog', JSON.stringify(this.prepareJournalLogForSaving(journal.log)));
    localStorage.setItem('journalstructure', JSON.stringify(journal.structure));
  }

  storeJournalLog(journallog: JournalLog) {
    localStorage.setItem('journallog', JSON.stringify(this.prepareJournalLogForSaving(journallog)));
  }

  storePin(pin) {
    localStorage.setItem('pin', pin);
  }

  storeConfigFile(configFile: ConfigFile) {
    localStorage.setItem('configFile', JSON.stringify(configFile));
  }

  getPin(): number {
    return parseInt(localStorage.getItem('pin'), 0);
  }

  getConfigFile() {
    return JSON.parse(localStorage.getItem('configFile'));
  }

  getJournalLog(): JournalLog {
    return this.extractSavedJournalLog(JSON.parse(localStorage.getItem('journallog')));
  }

  getJournalStructure(): JournalStructure {
    return JSON.parse(localStorage.getItem('journalstructure'));
  }

  getJournal(): Journal {
    const journal = new Journal();
    journal.log = this.getJournalLog();
    journal.structure = this.getJournalStructure();
    return journal;
  }

  prepareJournalLogForSaving(journalLog: JournalLog) {

    const protoObj = new Object();
    protoObj['sets'] = [];

    journalLog.sets.forEach((element) => {
      const setObj = new Object();
      setObj['maps'] = [];
      element.forEach((val, key) => {
        setObj['maps'].push({ key, val });

      });
      protoObj['sets'].push(setObj);
    });
    return protoObj;
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

  extractSavedJournalLog(protoObj) {
    const singleton = new JournalLog();
    singleton.sets = [];
    protoObj['sets'].forEach(set => {
      const protoSet = new Map<number, any[]>();
      set['maps'].forEach((obj) => {
        protoSet.set(obj.key, obj.val);
      });
      singleton.sets.push(protoSet);
    });
    return singleton;
  }


}
