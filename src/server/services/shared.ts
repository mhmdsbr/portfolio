export class NotFoundError extends Error {
  constructor(what: string) {
    super(`${what} not found`)
    this.name = 'NotFoundError'
  }
}

export function assertFound<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) throw new NotFoundError(what)
  return value
}

/** Postgres unique_violation (SQLSTATE 23505). */
export function isUniqueViolation(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === '23505'
  )
}
