import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { JournalLogService } from '../../services/journal-log.service';
import { Test } from 'src/app/shared/models/testspecific/test.model';

@Component({
  selector: 'app-speed-test-card',
  templateUrl: './speed-test-card.component.html',
  styleUrls: ['./speed-test-card.component.scss']
})
export class SpeedTestCardComponent implements OnInit, OnChanges {

  @Input() singleTest: Test;
  optionsSplit = [];
  coloredOptions = [];
  choosenOptions = [];
  done = true;
  started = true;


  constructor(private journalLogService: JournalLogService) { }

  ngOnChanges() {
    this.choosenOptions = this.journalLogService.getModelByID(this.singleTest.id);
    if (this.choosenOptions.every(e => e === false)) {
      this.done = false;
      this.started = false;
    }
  }

  ngOnInit() {
    this.singleTest.options.forEach(rawOpt => {
      const opt = rawOpt.text;
      this.optionsSplit.push(opt.split(''));
      const temp = [];
      opt.split('').forEach(() => {
        temp.push(false);
      });
      this.coloredOptions.push(temp);
    });
  }

  startTask() {
    this.started = true;
  }

  endTask() {
    this.done = true;

    for (let i = 0; i < this.choosenOptions.length; i++) {
      if (this.choosenOptions[i] === false) {
        this.choosenOptions[i] = '';
      }
    }
    this.journalLogService.refreshJournalLog();
  }

  spanMouseAction(over: boolean, i: number, j: number) {

    if (this.done) {
      return;
    }

    if (j < 3) {
      j = 3;
    } else if (j > this.coloredOptions[i].length - 3) {
      j = this.coloredOptions[i].length - 3;
    }

    for (let k = j - 3; k < j + 3; k++) {
      this.coloredOptions[i][k] = over;
    }
  }

  spanClickAction(i: number, j: number) {

    if (this.done) {
      return;
    }

    if (j < 3) {
      j = 3;
    } else if (j > this.coloredOptions[i].length - 3) {
      j = this.coloredOptions[i].length - 3;
    }

    this.choosenOptions[i] = this.optionsSplit[i].slice(j - 3, j + 3).join('');
    this.journalLogService.refreshJournalLog();
  }

  removeOption(i) {
    this.choosenOptions[i] = false;
  }

}
