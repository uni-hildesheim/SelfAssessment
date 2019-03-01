import { Component, OnInit, Input } from '@angular/core';
import { ResultTest } from 'src/app/shared/models/evaluation/result.test';

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
  @Input() tests: ResultTest[];

  constructor() {}

  ngOnInit() {}

  /**
   * Checks whether the user actually choose an answer.
   *
   * @param test The test.
   */
  public checkDismissed(test: ResultTest): boolean {
    return test.correctOptions.length  === 0 &&
      test.wrongOptions.length === 0;
  }

}
