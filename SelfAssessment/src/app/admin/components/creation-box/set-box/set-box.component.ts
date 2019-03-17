import { TestSet } from './../../../../shared/models/procedure/testset.model';
import { Component, OnInit } from '@angular/core';
import { ConfigDataService } from 'src/app/admin/services/config-data.service';
import { SetElement } from 'src/app/shared/models/procedure/set.element.model';

@Component({
  selector: 'app-set-box',
  templateUrl: './set-box.component.html',
  styleUrls: ['./set-box.component.scss', '../box-style.scss']
})
export class SetBoxComponent implements OnInit {

  sets: TestSet[];
  constructor(
    private configData: ConfigDataService
  ) { }

  ngOnInit() {
    this.sets = this.configData.sets.getValue();
  }

  addSet() {
    const set: TestSet = {
      id: this.configData.createUniqueKey(this.sets, 'set'),
      elements: [],
       scoreIndepentText: '',
       scoreDependentTexts: []
    };

    this.sets.push(set);
    this.configData.refreshSets();
  }

  addScoreDepText(set: TestSet) {
    set.scoreDependentTexts.push([0, '']);
  }

  addElementToSet(element, set) {
    set.elements.push(element);
    this.configData.refreshSets();
  }

  getPossibleElements(set) {
    return (this.configData.tests.getValue() as SetElement[])
    .concat(this.configData.infopages.getValue() as SetElement[])
    .concat(this.configData.testgroups.getValue() as SetElement[])
    // .map(t => t.id)
    .filter(t => set.elements.indexOf(t) === -1);
  }

  removeElement(idSet, idElem) {
    this.sets.find(g => g.id === idSet).elements =
    this.sets.find(g => g.id === idSet).elements.filter(t => t !== idElem);
    this.configData.refreshSets();
  }

}
