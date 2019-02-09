import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LogLevel } from './log.level.enum';
import { BehaviorSubject } from 'rxjs';

/**
 * The logging service used throughout the application.
 */
@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  /**
   * The log level.
   */
  private static readonly LOG_LEVEL: LogLevel = environment.loglevel;

  /**
   * Specifies the mode.
   */
  private static readonly PRODUCTION: boolean = environment.production;

  /**
   * Buffer size. If the buffer size is reached the log messages are send to the backend.
   */
  private static readonly BUFFER_SIZE = 5;

  /**
   * Queue which contains the log messages. This component subscribes to this queue
   * and sends the messages to the backend.
   */
  private queue: BehaviorSubject<string[]>;

  constructor() {
    this.init();
  }

  /**
   * Subscribes to the message queue and checks its size against the buffer size.
   */
  private init(): void {
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

  /**
   *
   * Takes care of the actual logging to the browser console.
   *
   * @param level The log level.
   * @param consoleMethod The console method.
   * @param message The log message.
   * @param object An optional object.
   * @param table Specifies if the object should be logged as a table.
   */
  private log(level: LogLevel, consoleMethod, message?: string, object?: any, table?: any): void {

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
        logMessage += JSON.stringify(object);
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

  /**
   * Log method for the info level.
   *
   * @param message The message.
   * @param object An optional object.
   * @param table Specifies if the object is a table.
   */
  public info(message: string, object?: any, table?: boolean): void {
    this.log(LogLevel.INFO, console.info, message, object, table);
  }

  /**
   * Log method for the warn level.
   *
   * @param message The message.
   * @param object An optional object.
   * @param table Specifies if the object is a table.
   */
  public warn(message: string, object?: any, table?: boolean): void {
    this.log(LogLevel.WARN, console.warn, message, object, table);
  }

  /**
   * Log method for the error level.
   *
   * @param message The message.
   * @param object An optional object.
   * @param table Specifies if the object is a table.
   */
  public error(message: string, object?: any, table?: boolean): void {
    this.log(LogLevel.ERROR, console.error, message, object, table);
  }

  /**
   * Log method for the debug level.
   *
   * @param message The message.
   * @param object An optional object.
   * @param table Specifies if the object is a table.
   */
  public debug(message?: string, object?: any, table?: boolean): void {
    this.log(LogLevel.DEBUG, console.log, message, object, table);
  }

}
