import { HttpClient } from '@angular/common/http';
import { Level } from './const.log.level';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

/**
 * This is the logging service, used throughout the frontend application.
 */
@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  /**
   * The log level.
   */
  private static readonly LOG_LEVEL: number = environment.logSettings.level;

  /**
   * Indicates the mode.
   */
  private static readonly PRODUCTION: boolean = environment.production;

  /**
   * The buffer size.
   */
  private static readonly BUFFER_SIZE: number = environment.logSettings.logBufferSize;

  /**
   * Whether the messages are logged with a timestamp (only for production).
   */
  private static readonly LOG_TIME: boolean = environment.logSettings.logtime;

  /**
   * The logging route to the backend.
   */
  public static readonly LOG_API = 'api/v1/logger/log';

  /**
   * The buffer.
   */
  private buffer: any[] = [];

  /**
   * Helper variable.
   */
  private tempLevel;

  /**
   * Constructor for the logging service.
   */
  constructor(
    private http: HttpClient
  ) {}

  /**
   * Logs the message to the console using the appropriate level (only for production: false)
   * @param level The log level.
   */
  public log(level) {
    return Level.properties[level].method.bind(console, this.buildLogPrefix(level));
  }

  /**
   * Builds a log prefix, according to a specific log level.
   * @param level The log level.
   */
  public buildLogPrefix(level): string {
    let prefix = `[${Level.properties[level].string}] `;
    if (LoggingService.LOG_TIME) {
      prefix += this.time + ' ';
    }
    return prefix;
  }

  /**
   * Info logging method.
   */
  get info() {
    if (( LoggingService.LOG_LEVEL < Level.INFO)
    && LoggingService.LOG_LEVEL !== Level.ALL) {
    return () => {};
  }
    if (LoggingService.PRODUCTION) {
      this.tempLevel = Level.INFO;
      return this.addToBuffer;
    } else {
      return this.log(Level.INFO);
    }
  }

  /**
   * Warn logging method.
   */
  get warn() {
    if (( LoggingService.LOG_LEVEL < Level.WARN)
    && LoggingService.LOG_LEVEL !== Level.ALL) {
    return () => {};
  }
    if (LoggingService.PRODUCTION) {
      this.tempLevel = Level.WARN;
      return this.addToBuffer;
    } else {
      return this.log(Level.WARN);
    }
  }

  /**
   * Error logging method.
   */
  get error() {
    if (LoggingService.PRODUCTION) {
      this.tempLevel = Level.ERROR;
      return this.sendErrorToBackend;
    } else {
      return this.log(Level.ERROR);
    }
  }

  /**
   * Debug logging method.
   */
  get debug() {
    if (( LoggingService.LOG_LEVEL < Level.DEBUG)
    && LoggingService.LOG_LEVEL !== Level.ALL) {
    return () => {};
  }
    if (LoggingService.PRODUCTION) {
      this.tempLevel = Level.DEBUG;
      return this.addToBuffer;
    } else {
      return this.log(Level.DEBUG);
    }
  }

  /**
   * Creates a log entry.
   */
  public createLogEntry(args, noPrefix?) {
    let message = (!noPrefix) ? this.buildLogPrefix(this.tempLevel) : '';
    args.forEach(e => {
      if (e instanceof Object) {
        message += JSON.stringify(e, null, 2);
      } else {
        message += e;
      }
      message += '\n';
    });
    return message;
  }

  /**
   * Adds message to the buffer, if the buffer is full send the content to the backend.
   */
  addToBuffer(...args) {
    this.buffer.push(this.createLogEntry(args));
    if (this.buffer.length >= LoggingService.BUFFER_SIZE) {
      const messages = this.buffer;
      this.http.post(LoggingService.LOG_API, {level: 0, messages}).subscribe();
    }
  }

  /**
   * Sends the Error straight to the backend without adding it to the buffer.
   */
  sendErrorToBackend(...args) {
    const message = this.createLogEntry(args, true);
    this.http.post(LoggingService.LOG_API, {level: 1, message}).subscribe();
  }

  /**
   * Creates a timestamp.
   */
  get time() {
    const date = new Date();
    const timestamp =
    `${date.getFullYear()}-${date.getMonth()}-` +
    `${date.getDay()} ${date.getHours()}:` +
    `${date.getMinutes()}:${date.getSeconds()}`;
    return timestamp;
  }

}
