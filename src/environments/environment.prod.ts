import { LogLevel } from '../app/services/log-level';

export const environment = {
  production: true,
  // Only show WARN+ERROR in production
  logLevel: LogLevel.WARN
};
