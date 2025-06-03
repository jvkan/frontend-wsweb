import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LogLevel } from './log-level';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  // Set the active log level from environment
  private level: LogLevel = environment.logLevel;

  constructor() {}

  /** Log a DEBUG-level message if level ≤ DEBUG */
  debug(message: string, ...optionalParams: any[]) {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...optionalParams);
    }
  }

  /** Log an INFO-level message if level ≤ INFO */
  info(message: string, ...optionalParams: any[]) {
    if (this.level <= LogLevel.INFO) {
      console.info(`[INFO ] ${new Date().toISOString()} - ${message}`, ...optionalParams);
    }
  }

  /** Log a WARN-level message if level ≤ WARN */
  warn(message: string, ...optionalParams: any[]) {
    if (this.level <= LogLevel.WARN) {
      console.warn(`[WARN ] ${new Date().toISOString()} - ${message}`, ...optionalParams);
    }
  }

  /** Log an ERROR-level message (always logged unless level = NONE) */
  error(message: string, ...optionalParams: any[]) {
    if (this.level <= LogLevel.ERROR) {
      console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...optionalParams);
    }
  }
}
