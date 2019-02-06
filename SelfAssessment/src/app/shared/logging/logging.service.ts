import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LogLevel } from './log.level.enum';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  private static readonly LOG_LEVEL: LogLevel = environment.loglevel;
  private static readonly PRODUCTION: boolean = environment.production;
  private static readonly BUFFER_SIZE = 5;
  private queue: BehaviorSubject<string[]>;

  constructor() {
    this.init();
  }

  init() {
    this.queue = new BehaviorSubject([]);
    this.queue.subscribe(
      (data) => {
        if (data.length === LoggingService.BUFFER_SIZE) {
          // TODO: send logging statements to backend
          // empty queue
          this.queue.next([]);
        }
      }
    );
  }

  log(level: LogLevel, consoleMethod, message?: string, object?: any, table?: any) {

    // dont log if its not the appropriate level
    if (LoggingService.LOG_LEVEL !== level &&
      LoggingService.LOG_LEVEL !== LogLevel.ALL) {
      return;
    }

    const date = new Date();
    const timestamp =
      `${date.getFullYear()}-${date.getMonth()}-` +
      `${date.getDay()} ${date.getHours()}:` +
      `${date.getMinutes()}:${date.getSeconds()}`;

    const logMessagePrefix = `[${level}] ${timestamp} `;
    let logMessage = `${logMessagePrefix} ${message}`;

    // push log message to queue and notify observers
    this.queue.getValue().push(logMessage);
    this.queue.next(this.queue.getValue());

    // dont log to the console if prod mode is enabled
    if (LoggingService.PRODUCTION) {
      if (object) {
        logMessage += JSON.stringify(object, null, 2);
      }
      return;
    }

    // show output on console if dev mode is enabled and
    // message is defined
    if (message) {
      consoleMethod(logMessage);
    }

    // log objects on next line
    if (object) {
      if (table) {
        consoleMethod(logMessagePrefix);
        console.table(object);
      } else {
        consoleMethod(logMessagePrefix, object);
      }
    }
  }

  info(message: string, object?: any, table?: boolean) {
    this.log(LogLevel.INFO, console.info, message, object, table);
  }

  warn(message: string, object?: any, table?: boolean) {
    this.log(LogLevel.WARN, console.warn, message, object, table);
  }

  error(message: string, object?: any, table?: boolean) {
    this.log(LogLevel.ERROR, console.error, message, object, table);
  }

  debug(message?: string, object?: any, table?: boolean) {
    this.log(LogLevel.DEBUG, console.log, message, object, table);
  }

}
