import { HttpClient } from '@angular/common/http';
import { Level } from './const.log.level';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  private static readonly LOG_LEVEL: number = environment.logSettings.level;

  private static readonly PRODUCTION: boolean = environment.production;

  private static readonly BUFFER_SIZE: number = environment.logSettings.logBufferSize;

  private static readonly LOG_TIME: boolean = environment.logSettings.logtime;

  public static readonly LOG_API = 'api/v1/logger/log';

  private buffer: any[] = [];

  private tempLevel;

  constructor(
    private http: HttpClient
  ) {}


  log(level) {
    return Level.properties[level].method.bind(console, this.buildLogPrefix(level));
  }

  buildLogPrefix(level): string {
    let prefix = `[${Level.properties[level].string}] `;
    if (LoggingService.LOG_TIME) {
      prefix += this.time + ' ';
    }
    return prefix;
  }


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

  get error() {
    if (LoggingService.PRODUCTION) {
      this.tempLevel = Level.ERROR;
      return this.sendErrorToBackend;
    } else {
      return this.log(Level.ERROR);
    }
  }

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


  createLogEntry(args, noPrefix?) {
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


  addToBuffer(...args) {
    this.buffer.push(this.createLogEntry(args));
    if (this.buffer.length >= LoggingService.BUFFER_SIZE) {
      const messages = this.buffer;
      this.http.post(LoggingService.LOG_API, {level: 0, messages}).subscribe();
    }
  }

  sendErrorToBackend(...args) {
    const message = this.createLogEntry(args, true);
    this.http.post(LoggingService.LOG_API, {level: 1, message}).subscribe();
  }

  get time() {
    const date = new Date();
    const timestamp =
    `${date.getFullYear()}-${date.getMonth()}-` +
    `${date.getDay()} ${date.getHours()}:` +
    `${date.getMinutes()}:${date.getSeconds()}`;
    return timestamp;
  }

}
