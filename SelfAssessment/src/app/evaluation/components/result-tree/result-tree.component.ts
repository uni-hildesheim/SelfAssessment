import { Component, OnInit, Input } from '@angular/core';
import { ResultSet } from 'src/app/shared/models/evaluation/result.set';
import { RawResultTest } from 'src/app/shared/models/evaluation/raw/raw.result.test';

/**
 * Component that displays all the results of every evaluated test
 * inside a specific test.
 */
@Component({
  selector: 'app-result-tree',
  templateUrl: './result-tree.component.html',
  styleUrls: ['./result-tree.component.scss']
})
export class TestResultPanelComponent implements OnInit {

  /**
   * The result set which contains all the set-specific tests.
   */
  @Input() set: ResultSet;

  constructor() {}

  ngOnInit() {}

  /**
   * Checks whether the user actually choose an answer.
   *
   * @param test The test.
   */
  public checkDismissed(test: RawResultTest): boolean {
    return test.correctOptions.length  === 0 &&
      test.wrongOptions.length === 0;
  }

}
