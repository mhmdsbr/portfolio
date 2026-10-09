import { profileFactRepo } from '@/server/repos/collections'
import { getContactMethodsWithSections } from '@/server/repos/contact-methods'
import { profileRepo } from '@/server/repos/singletons'
import { requireSection } from './page-sections'
import { assertFound } from './shared'

export async function getAbout() {
  const [profile, { section }, details, contactMethods] = await Promise.all([
    profileRepo.get(),
    requireSection('about'),
    profileFactRepo.list(),
    getContactMethodsWithSections(),
  ])

  return {
    section,
    profile: {
      name: profile?.name ?? null,
      jobTitle: profile?.jobTitle ?? null,
      biography: profile?.biography ?? null,
    },
    details,
    contactMethods,
  }
}

export async function saveProfile(input: {
  name: string | null
  jobTitle: string | null
  biography: string | null
}) {
  await profileRepo.save({
    name: input.name,
    jobTitle: input.jobTitle,
    biography: input.biography,
  })
}


export async function createDetail(input: { number: number; title: string }) {
  return profileFactRepo.append(input)
}

export async function updateDetail(
  id: number,
  input: { number: number; title: string },
) {
  return assertFound(
    await profileFactRepo.update(id, input),
    'Detail',
  )
}

export async function deleteDetail(id: number) {
  await profileFactRepo.remove(id)
}

export async function reorderDetails(ids: number[]) {
  return profileFactRepo.reorder(ids)
}
