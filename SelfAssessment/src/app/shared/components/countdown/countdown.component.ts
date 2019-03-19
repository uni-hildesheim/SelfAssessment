import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { timer } from 'rxjs';
import { take, map } from 'rxjs/operators';


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

    const obs = timer(100, 1000)
    .pipe(
      map(i => this.seconds - i),
      take(this.seconds + 1)
    );

    obs.subscribe({
      next: x => {
        this.counter = this.seconds - x;
        this.current = Math.ceil((x / this.seconds) * 100);
      },
      complete: () => {
        this.finished.emit(true);
      }
    });
  }

}
