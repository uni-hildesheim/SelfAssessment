import { Component, OnInit } from '@angular/core';
import { JournalService } from 'src/app/shared/services/journal.service';
import { GlobalIndicator } from '../../global.indicators';
import { MatStepper } from '@angular/material';
import { JournalStructure } from 'src/app/shared/models/state/journal.structure.model';
import { JournalLogService } from '../../services/journal-log.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.scss']
})
export class MainPanelComponent implements OnInit {

  public journalStructure: JournalStructure;
  private updateProtocol: boolean;

  constructor(
    private journalService: JournalService,
    private journalLogService: JournalLogService,
    private globals: GlobalIndicator,
    private storageService: LocalStorageService
  ) { }

  ngOnInit() {

    this.journalStructure = this.storageService.getJournalStructure();
    this.journalLogService.getJournalLogAsObservable().subscribe(
      (data) => {
        this.updateProtocol = true;
        console.log('JOURNAL LOG CHANGED');
        console.log(data);
      }
    );
  }


  moveToNextSetElement(foward: boolean, stepper: MatStepper) {

    if (this.currentElements[this.setElemIndex].setType === 'test' && this.updateProtocol) {
      this.journalService.saveJournalLog(
        this.storageService.prepareJournalLogForSaving(this.journalLogService.journalLogInstance)
        ).subscribe(
        data => {
          console.log(data);
          this.updateProtocol = false;
        },
        err => console.log(err)
      );
    }

    if (foward) {
      if (this.setElemIndex === this.currentElements.length - 1) {
        stepper.next();
        this.setElemIndex = 0;
        this.setIndex = this.setIndex + 1;
      } else {
        this.setElemIndex = this.setElemIndex + 1;
      }

    } else {
      if (this.setElemIndex === 0) {
        stepper.previous();
        this.setIndex = this.setIndex - 1;
        this.setElemIndex = this.currentElements.length - 1;

      } else {
        this.setElemIndex = this.setElemIndex - 1;
      }
    }
  }

  get currentSet() {
    return this.journalStructure.sets[this.setIndex];
  }

  get currentElements() {
    return this.journalStructure.sets[this.setIndex].elements;
  }

  // getters and setters referencing the global indices

  set setIndex(set: number) {
    this.globals.setIndex = set;
  }

  set setElemIndex(test: number) {
    this.globals.setElemIndex = test;
  }

  get setIndex() {
    return this.globals.setIndex;
  }

  get setElemIndex() {
    return this.globals.setElemIndex;
  }


}
