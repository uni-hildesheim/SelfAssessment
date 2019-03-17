import { ConfigDataService } from './../../services/config-data.service';
import { Component, OnInit, Input } from '@angular/core';
import { SetElement } from 'src/app/shared/models/procedure/set.element.model';

@Component({
  selector: 'app-element-picker',
  templateUrl: './element-picker.component.html',
  styleUrls: ['./element-picker.component.scss']
})
export class ElementPickerComponent implements OnInit {


  @Input() title: string;
  @Input() elementsInParent: any[];

  @Input() tests?: boolean;
  @Input() infopages?: boolean;
  @Input() sets?: boolean;
  @Input() testgroups?: boolean;

  constructor(
    public configData: ConfigDataService
  ) { }

  ngOnInit() { }

  getPossibleElements() {
    let elements = [];

    if (this.tests) {
      elements = elements.concat(this.configData.tests.getValue());
    }
    if (this.infopages) {
      elements = elements.concat(this.configData.infopages.getValue());
    }
    if (this.testgroups) {
      elements = elements.concat(this.configData.testgroups.getValue());
    }
    if (this.sets) {
      elements = elements.concat(this.configData.sets.getValue());
    }
    elements = elements.filter(t => this.elementsInParent.indexOf(t) === -1);

    return elements;
  }

  addElement(element) {
    this.elementsInParent.push(element);
  }

  removeElement(element) {
    this.elementsInParent = this.elementsInParent.filter(e => e.id !== element.id);
  }

}
