export class NotFoundError extends Error {
  constructor(readonly what: string) {
    super(`${what} not found`)
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends Error {
  constructor(message: string, readonly fieldPath?: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export function assertFound<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) throw new NotFoundError(what)
  return value
}

/** Postgres unique_violation (SQLSTATE 23505), including Drizzle-wrapped causes. */
export function isUniqueViolation(error: unknown): boolean {
  let current: unknown = error
  for (let depth = 0; depth < 5 && typeof current === 'object' && current !== null; depth++) {
    if ('code' in current && current.code === '23505') return true
    current = 'cause' in current ? current.cause : undefined
  }
  return false
}
