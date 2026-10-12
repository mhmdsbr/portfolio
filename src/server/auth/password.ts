import { randomBytes, randomInt, scrypt, timingSafeEqual } from 'node:crypto'

const SCRYPT_COST = 32768
const SCRYPT_BLOCK_SIZE = 8
const SCRYPT_PARALLELIZATION = 1
const SCRYPT_KEY_LENGTH = 64
const SCRYPT_MAX_MEMORY = 64 * 1024 * 1024

function derivePasswordKey(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(
      password,
      salt,
      SCRYPT_KEY_LENGTH,
      {
        N: SCRYPT_COST,
        r: SCRYPT_BLOCK_SIZE,
        p: SCRYPT_PARALLELIZATION,
        maxmem: SCRYPT_MAX_MEMORY,
      },
      (error, derivedKey) => {
        if (error) {
          reject(error)
        } else {
          resolve(derivedKey)
        }
      },
    )
  })
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16)
  const derivedKey = await derivePasswordKey(password, salt)

  return `scrypt$${SCRYPT_COST}$${SCRYPT_BLOCK_SIZE}$${SCRYPT_PARALLELIZATION}$${salt.toString('base64url')}$${derivedKey.toString('base64url')}`
}

export async function verifyPassword(password: string, storedHash: string) {
  if (password.length > 256) return false

  const [algorithm, cost, blockSize, parallelization, encodedSalt, encodedKey] =
    storedHash.split('$')

  if (
    algorithm !== 'scrypt' ||
    cost !== String(SCRYPT_COST) ||
    blockSize !== String(SCRYPT_BLOCK_SIZE) ||
    parallelization !== String(SCRYPT_PARALLELIZATION) ||
    !encodedSalt ||
    !encodedKey
  ) {
    return false
  }

  const salt = Buffer.from(encodedSalt, 'base64url')
  const expectedKey = Buffer.from(encodedKey, 'base64url')
  if (salt.length !== 16 || expectedKey.length !== SCRYPT_KEY_LENGTH) {
    return false
  }

  const actualKey = await derivePasswordKey(password, salt)

  return timingSafeEqual(actualKey, expectedKey)
}

/** New 6-digit code plus the salt and hash to store (base64url). */
export async function generateVerificationCode() {
  const code = String(randomInt(100_000, 1_000_000))
  const codeSalt = randomBytes(16)
  const codeHash = await derivePasswordKey(code, codeSalt)
  return {
    code,
    codeSalt: codeSalt.toString('base64url'),
    codeHash: codeHash.toString('base64url'),
  }
}

export function generateChallengeId() {
  return randomBytes(32).toString('base64url')
}

/** "malformed" means the stored salt/hash are unusable; it is not a wrong code. */
export async function checkVerificationCode(
  code: string,
  storedSalt: string,
  storedHash: string,
) {
  const salt = Buffer.from(storedSalt, 'base64url')
  const expectedHash = Buffer.from(storedHash, 'base64url')
  if (salt.length !== 16 || expectedHash.length !== SCRYPT_KEY_LENGTH) {
    return 'malformed' as const
  }
  const candidateHash = await derivePasswordKey(code, salt)
  return timingSafeEqual(candidateHash, expectedHash)
    ? ('match' as const)
    : ('mismatch' as const)
}
