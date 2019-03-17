import { ConfigDataService } from './../../../services/config-data.service';
import { Component, OnInit } from '@angular/core';

interface Testgroup {
  id: any;
  select: number;
  tests: any[];
}

@Component({
  selector: 'app-testgroup-box',
  templateUrl: './testgroup-box.component.html',
  styleUrls: ['./testgroup-box.component.scss', '../box-style.scss']
})
export class TestgroupBoxComponent implements OnInit {

  testgroups: Testgroup[];

  constructor(
    public configData: ConfigDataService
  ) { }

  ngOnInit() {
    this.testgroups = this.configData.testgroups.getValue();

  }

  getPossibleTests(group) {
    return this.configData.tests.getValue()
    .filter(t => group.tests.indexOf(t) === -1);
  }


  addTestToTestgroup(val, group) {
    group.tests.push(val);
    this.configData.refreshTestgroup();
  }

  addTestgroup() {

    const group: Testgroup = {
      id: this.configData.createUniqueKey(this.testgroups, 'testgroup'),
      select: 0,
      tests: []
    };

    this.testgroups.push(group);
  }

  deleteTestgroup(group) {
    this.testgroups = this.testgroups.filter(t => t !== group);
    this.configData.refreshTestgroup();
  }

  removeTest(idGroup, idTest) {
    this.testgroups.find(g => g.id === idGroup).tests =
    this.testgroups.find(g => g.id === idGroup).tests.filter(t => t !== idTest);
    this.configData.refreshTestgroup();
  }



}
