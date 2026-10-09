/**
 * Structured logging utility.
 * In production, logs are JSON-format for ingest by monitoring systems.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  error?: {
    message: string
    stack?: string
  }
}

function formatLog(entry: LogEntry): string {
  // In production, always use JSON for structured logging
  if (process.env.NODE_ENV === 'production') {
    return JSON.stringify(entry)
  }
  // In development, use readable format
  const ctx = entry.context ? ` ${JSON.stringify(entry.context)}` : ''
  const err = entry.error ? ` ${entry.error.message}` : ''
  return `[${entry.level.toUpperCase()}] ${entry.timestamp} ${entry.message}${ctx}${err}`
}

export function log(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
  error?: Error
) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
    ...(error
      ? { error: { message: error.message, stack: error.stack } }
      : {}),
  }
  console.log(formatLog(entry))
}

export const logger = {
  info: (msg: string, ctx?: Record<string, unknown>) =>
    log('info', msg, ctx),
  warn: (msg: string, ctx?: Record<string, unknown>) =>
    log('warn', msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>, err?: Error) =>
    log('error', msg, ctx, err),
  debug: (msg: string, ctx?: Record<string, unknown>) =>
    log('debug', msg, ctx),
}
