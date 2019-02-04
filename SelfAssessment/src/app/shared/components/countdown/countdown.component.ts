import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {

  @Input() seconds: number;
  @Output() finished: EventEmitter<any> = new EventEmitter<any>();
  current;
  counter;
  interval;


  constructor() { }

  ngOnInit() {
    this.current = 0;
    this.counter = 0;
    this.startTimer();
  }

  startTimer() {
    this.interval = setInterval(() => {

      if (this.counter < this.seconds) {
        this.counter++;
        this.current = Math.ceil((this.counter / this.seconds) * 100);

      } else {
        this.notifyObservers();
        clearInterval(this.interval);
      }

    }, 1000);
  }

  notifyObservers() {
    this.finished.emit(true);
  }
}
