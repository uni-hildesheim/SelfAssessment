import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-switch-mode',
  templateUrl: './switch-mode.component.html',
  styleUrls: ['./switch-mode.component.scss']
})
export class SwitchModeComponent implements OnInit {

  @Output() buildOut = new EventEmitter<boolean>();
  @Output() endOut = new EventEmitter<boolean>();
  build = false;

  constructor() { }

  ngOnInit() {
  }

  changeMode() {
    this.build = !this.build;
    this.buildOut.emit(this.build);
  }

  endBuild() {
    this.endOut.emit(true);
  }

}
