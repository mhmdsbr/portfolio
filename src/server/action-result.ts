import { isUniqueViolation, NotFoundError, ValidationError } from '@/server/services/shared'
import { requireAuth } from '@/lib/auth'

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string }

function isRedirectError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    typeof error.digest === 'string' &&
    error.digest.startsWith('NEXT_REDIRECT')
  )
}

export async function runAction<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    const data = await fn()
    return data === undefined ? { success: true } : { success: true, data }
  } catch (error) {
    if (isRedirectError(error)) throw error
    if (error instanceof ValidationError) return { success: false, error: error.message }
    if (error instanceof NotFoundError) {
      return { success: false, error: `${error.what} was not found` }
    }
    if (isUniqueViolation(error)) {
      const constraint = getUniqueConstraint(error)
      return {
        success: false,
        error: constraint?.includes('email')
          ? 'An account with that email already exists.'
          : 'An item with these details already exists.',
      }
    }
    console.error('Server action failed:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

function getUniqueConstraint(error: unknown): string | undefined {
  let current: unknown = error
  for (let depth = 0; depth < 5 && typeof current === 'object' && current !== null; depth++) {
    if ('constraint' in current && typeof current.constraint === 'string') return current.constraint
    current = 'cause' in current ? current.cause : undefined
  }
  return undefined
}

export function withAuthAction<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
): (...args: TArgs) => Promise<ActionResult<TResult>> {
  return (...args) => runAction(async () => {
    await requireAuth()
    return fn(...args)
  })
}

