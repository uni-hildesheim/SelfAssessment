import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Test } from 'src/app/shared/models/testspecific/test.model';
import { JournalLogService } from '../../services/journal-log.service';

@Component({
  selector: 'app-single-test-card',
  templateUrl: './single-test-card.component.html',
  styleUrls: ['./single-test-card.component.scss']
})
export class SingleTestCardComponent implements OnInit, OnChanges {

  @Input() singleTest: Test;
  public models: any[] = [];

  constructor(private journalLogService: JournalLogService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.models = this.journalLogService.getModelByID(this.singleTest.id);
  }

  changeValue(type: string, checked: boolean, i: number, j?: number) {
    if (type === 'radio-buttons') {
      this.models.fill(false);
    }

    if (type === 'multiple-options') {
      this.models[i].fill(false);
      this.models[i][j] = checked;
    } else {
      this.models[i] = checked;
    }
    this.journalLogService.refreshJournalLog();
  }

}
