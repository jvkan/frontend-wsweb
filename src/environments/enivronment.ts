import { LogLevel } from '../app/services/log-level';

export const environment = {
  production: false,
  // Set DEBUG in dev so we see everything:
  logLevel: LogLevel.DEBUG
};
