import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

/**
 * Component that realizes a countdown.
 */
@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {

  /**
   * The countdown time in seconds.
   */
  @Input() seconds: number;

  /**
   * The event emitter which is emited when the countdown ends.
   */
  @Output() finished: EventEmitter<any> = new EventEmitter<any>();

  /**
   * The current time in percent to display at the progress spinner.
   */
  public current: number;

  /**
   * The current time in seconds.
   */
  public counter: number;

  /**
   * The interval instance.
   */
  public interval: any;


  constructor() { }

  /**
   * Initalize the variables and start the countdown.
   */
  ngOnInit() {
    this.current = 0;
    this.counter = 0;
    this.startTimer();
  }

  /**
   * Starts the countdown.
   */
  public startTimer(): void {
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

  /**
   * Notifies the component which embedded this component.
   */
  public notifyObservers(): void {
    this.finished.emit(true);
  }
}
