/**
 * Log Service
 * Technical logs for errors, warnings, and debug info
 * MVP: console.log, Production: Datadog/LogRocket/etc.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  event_id: string;
  properties?: Record<string, unknown>;
  timestamp: string;
}

function log(level: LogLevel, event_id: string, properties?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    event_id,
    properties,
    timestamp: new Date().toISOString(),
  };

  // MVP: Console logging
  // Production: Send to Datadog, LogRocket, etc.
  const logFn = level === 'error' ? console.error 
              : level === 'warn' ? console.warn 
              : console.log;
  
  logFn(`[${level.toUpperCase()}] ${event_id}`, properties || '');
  
  return entry;
}

export const logService = {
  info: (event_id: string, properties?: Record<string, unknown>) => 
    log('info', event_id, properties),
  
  warn: (event_id: string, properties?: Record<string, unknown>) => 
    log('warn', event_id, properties),
  
  error: (event_id: string, properties?: Record<string, unknown>) => 
    log('error', event_id, properties),
  
  debug: (event_id: string, properties?: Record<string, unknown>) => 
    log('debug', event_id, properties),
};
