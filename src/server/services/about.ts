import { optionalText, parseIdList, requiredInteger, requiredText } from '@/lib/validation'
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
  name: unknown
  jobTitle: unknown
  biography: unknown
}) {
  await profileRepo.save({
    name: optionalText(input.name),
    jobTitle: optionalText(input.jobTitle),
    biography: optionalText(input.biography),
  })
}

function parseDetail(input: { number: unknown; title: unknown }) {
  return {
    number: requiredInteger(input.number, 'Detail number'),
    title: requiredText(input.title, 'Detail title'),
  }
}

export async function createDetail(input: { number: unknown; title: unknown }) {
  return profileFactRepo.append(parseDetail(input))
}

export async function updateDetail(
  id: number,
  input: { number: unknown; title: unknown },
) {
  return assertFound(
    await profileFactRepo.update(id, parseDetail(input)),
    'Detail',
  )
}

export async function deleteDetail(id: number) {
  await profileFactRepo.remove(id)
}

export async function reorderDetails(ids: unknown) {
  return profileFactRepo.reorder(parseIdList(ids))
}
