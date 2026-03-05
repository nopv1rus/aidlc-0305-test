import type { ErrorCode } from './error-codes'

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly userMessage: string,
    public readonly retryable: boolean,
  ) {
    super(message)
    this.name = 'AppError'
  }
}
