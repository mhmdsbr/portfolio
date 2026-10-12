import type { CurrentAdmin } from '@/server/auth/types'
import { lockAdminActivation } from '@/server/repos/advisory-locks'
import { adminEmailVerificationsRepo } from '@/server/repos/admin-email-verifications'
import { adminProfilesRepo } from '@/server/repos/admin-profiles'
import { adminSessionsRepo } from '@/server/repos/admin-sessions'
import { adminUsersRepo } from '@/server/repos/admin-users'
import { runInTransaction } from '@/server/repos/executor'
import { isUniqueViolation } from './shared'

export async function getAdminCount() {
  await adminEmailVerificationsRepo.deleteExpired(new Date())
  return adminUsersRepo.count()
}

export async function getProfileSettings(identity: CurrentAdmin) {
  const profile = await adminProfilesRepo.findByUserId(identity.id)
  if (!profile) {
    throw new Error('Admin profile is missing for the authenticated account.')
  }

  const admins = await adminUsersRepo.listWithProfiles()

  return { admin: { ...identity, ...profile }, admins }
}

/** Input must already be validated and normalized. */
export async function updateMyProfile(
  adminId: number,
  input: {
    email: string
    displayName: string
    bio: string
    preferences: Record<string, unknown>
  },
) {
  try {
    await runInTransaction(async (transaction) => {
      await adminUsersRepo.updateEmail(adminId, input.email, transaction)
      await adminProfilesRepo.update(
        adminId,
        {
          displayName: input.displayName,
          bio: input.bio.trim() || null,
          preferences: input.preferences,
        },
        transaction,
      )
    })
  } catch (error) {
    if (isUniqueViolation(error)) {
      return {
        success: false as const,
        error: 'An account with that email already exists.',
      }
    }
    throw error
  }
  return { success: true as const }
}

export async function setAdminUserActive(
  currentAdminId: number,
  userId: number,
  active: boolean,
) {
  if (userId === currentAdminId && !active) {
    return {
      success: false as const,
      error: 'You cannot deactivate your own account.',
    }
  }

  let result: 'last-admin' | 'not-found' | 'updated'
  try {
    result = await runInTransaction(async (transaction) => {
      await lockAdminActivation(transaction)
      if (!active) {
        const activeAdmins = await adminUsersRepo.countActive(transaction)
        if (activeAdmins <= 1) return 'last-admin' as const
      }

      const updated = await adminUsersRepo.setActive(userId, active, transaction)
      if (!updated) return 'not-found' as const

      if (!active) {
        await adminSessionsRepo.deleteByUserId(userId, transaction)
      }
      return 'updated' as const
    })
  } catch (error) {
    if (isUniqueViolation(error)) {
      return {
        success: false as const,
        error: 'An account with that email already exists.',
      }
    }
    throw error
  }

  if (result === 'last-admin') {
    return {
      success: false as const,
      error: 'The last active admin account cannot be deactivated.',
    }
  }
  if (result === 'not-found') {
    return { success: false as const, error: 'Admin account was not found.' }
  }
  return { success: true as const }
}
