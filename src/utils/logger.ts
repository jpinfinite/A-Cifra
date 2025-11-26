/**
 * Utility de logging condicional
 * Logs apenas aparecem em desenvolvimento
 */

const isDev = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'test'

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

interface LogOptions {
  force?: boolean // Força log mesmo em produção
  prefix?: string // Prefixo para categorizar logs
}

class Logger {
  private shouldLog(level: LogLevel, force?: boolean): boolean {
    if (force) return true
    if (isTest) return false
    if (isDev) return true
    // Em produção, apenas errors
    return level === 'error'
  }

  private formatMessage(prefix: string | undefined, ...args: unknown[]): unknown[] {
    if (prefix) {
      return [`[${prefix}]`, ...args]
    }
    return args
  }

  log(...args: unknown[]): void
  log(options: LogOptions, ...args: unknown[]): void
  log(optionsOrArg: LogOptions | unknown, ...args: unknown[]): void {
    const isOptions = typeof optionsOrArg === 'object' && optionsOrArg !== null && ('force' in optionsOrArg || 'prefix' in optionsOrArg)
    const options = isOptions ? optionsOrArg as LogOptions : {}
    const logArgs = isOptions ? args : [optionsOrArg, ...args]

    if (this.shouldLog('log', options.force)) {
      console.log(...this.formatMessage(options.prefix, ...logArgs))
    }
  }

  info(...args: unknown[]): void
  info(options: LogOptions, ...args: unknown[]): void
  info(optionsOrArg: LogOptions | unknown, ...args: unknown[]): void {
    const isOptions = typeof optionsOrArg === 'object' && optionsOrArg !== null && ('force' in optionsOrArg || 'prefix' in optionsOrArg)
    const options = isOptions ? optionsOrArg as LogOptions : {}
    const logArgs = isOptions ? args : [optionsOrArg, ...args]

    if (this.shouldLog('info', options.force)) {
      console.info(...this.formatMessage(options.prefix, ...logArgs))
    }
  }

  warn(...args: unknown[]): void
  warn(options: LogOptions, ...args: unknown[]): void
  warn(optionsOrArg: LogOptions | unknown, ...args: unknown[]): void {
    const isOptions = typeof optionsOrArg === 'object' && optionsOrArg !== null && ('force' in optionsOrArg || 'prefix' in optionsOrArg)
    const options = isOptions ? optionsOrArg as LogOptions : {}
    const logArgs = isOptions ? args : [optionsOrArg, ...args]

    if (this.shouldLog('warn', options.force)) {
      console.warn(...this.formatMessage(options.prefix, ...logArgs))
    }
  }

  error(...args: unknown[]): void
  error(options: LogOptions, ...args: unknown[]): void
  error(optionsOrArg: LogOptions | unknown, ...args: unknown[]): void {
    const isOptions = typeof optionsOrArg === 'object' && optionsOrArg !== null && ('force' in optionsOrArg || 'prefix' in optionsOrArg)
    const options = isOptions ? optionsOrArg as LogOptions : {}
    const logArgs = isOptions ? args : [optionsOrArg, ...args]

    if (this.shouldLog('error', options.force)) {
      console.error(...this.formatMessage(options.prefix, ...logArgs))
    }
  }

  debug(...args: unknown[]): void
  debug(options: LogOptions, ...args: unknown[]): void
  debug(optionsOrArg: LogOptions | unknown, ...args: unknown[]): void {
    const isOptions = typeof optionsOrArg === 'object' && optionsOrArg !== null && ('force' in optionsOrArg || 'prefix' in optionsOrArg)
    const options = isOptions ? optionsOrArg as LogOptions : {}
    const logArgs = isOptions ? args : [optionsOrArg, ...args]

    if (this.shouldLog('debug', options.force)) {
      console.debug(...this.formatMessage(options.prefix, ...logArgs))
    }
  }

  // Métodos especializados para contextos específicos
  api(...args: unknown[]): void {
    this.log({ prefix: 'API' }, ...args)
  }

  newsletter(...args: unknown[]): void {
    this.log({ prefix: 'Newsletter' }, ...args)
  }

  article(...args: unknown[]): void {
    this.log({ prefix: 'Article' }, ...args)
  }

  adsense(...args: unknown[]): void {
    this.log({ prefix: 'AdSense' }, ...args)
  }

  performance(...args: unknown[]): void {
    this.log({ prefix: 'Performance' }, ...args)
  }
}

export const logger = new Logger()
