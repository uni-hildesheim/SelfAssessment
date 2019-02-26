import { Journal } from './journal.model';
import { JournalBuilder } from './journal.builder';
import { ConfigFile } from '../configuration/config.file.model';
import { JournalStructureMinimal } from './minimal/journal.structure.minimal';
import { JournalLog } from './journal.log.model';
import { JournalStructure } from './journal.structure.model';
import { TestSetMinimal } from './minimal/test.set.minimal';
import { SetElementType } from '../procedure/enums/element.type.enum';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class JournalDirectorService {

    private builder: JournalBuilder = new JournalBuilder();

    public createJournal(file: ConfigFile) {
        const journal = new Journal();
        journal.structure =  this.builder.assembleJournalStructure(file);
        journal.log = this.builder.assembleJournalLog(journal.structure);
        return journal;
    }

    public createJournalStructure(file: ConfigFile, minStruc: JournalStructureMinimal) {
        return this.builder.assembleJournalStructure(file, minStruc);
    }

    public prepareJournalLogForSaving(journalLog: JournalLog): Object {

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

    public prepareJournalStructureForSaving(struc: JournalStructure, name: string, lang: string): JournalStructureMinimal {

        // create the minimal object
        const rawSet: JournalStructureMinimal = {
          course: name,
          language: lang,
          sets: []
        };

        rawSet.sets =  struc.sets
        .map(set => {
            const minSet: TestSetMinimal =  {
                set: set.id,
                tests: set.elements
                .filter(e => e.elementType.valueOf() === SetElementType.TEST.valueOf())
                .map(e => e.id)
            };
            return minSet;
        });

        return rawSet;
      }

    public extractSavedJournalLog(rawLog): JournalLog {

        const singleton = new JournalLog();
        singleton.sets = [];
        rawLog['sets'].forEach(set => {
          const protoSet = new Map<number, any[]>();
          set['maps'].forEach((obj) => {
            protoSet.set(obj.key, obj.val);
          });
          singleton.sets.push(protoSet);
        });
        return singleton;
      }



}
