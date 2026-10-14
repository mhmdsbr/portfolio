import type { ContactMethodInput, SocialLinkInput } from '@/server/schemas/contact'
import { socialLinkRepo } from '@/server/repos/collections'
import {
  deleteContactMethodRow,
  getContactMethodsWithSections,
  insertContactMethodAtEnd,
  listContactMethodIds,
  setContactMethodOrder,
  setContactMethodSections,
  updateContactMethodRow,
} from '@/server/repos/contact-methods'
import { runInTransaction } from '@/server/repos/executor'
import { requireSection, updateSectionConfig } from './page-sections'
import { assertFound, NotFoundError, ValidationError } from './shared'


export async function getContact() {
  const [{ section, config }, contactMethods, socialLinks] = await Promise.all([
    requireSection('contact'),
    getContactMethodsWithSections(),
    socialLinkRepo.list(),
  ])
  return { section, config, contactMethods, socialLinks }
}

export async function updateContactSettings(input: {
  formTitle: string | null
  buttonText: string | null
  buttonUrl: string | null
}) {
  const { config } = await updateSectionConfig('contact', input)
  return config
}

export async function createContactMethod(input: ContactMethodInput) {
  const { kind, title, value, sections } = input
  const fields = { kind, title, value }
  const method = await runInTransaction(async (transaction) => {
    const created = await insertContactMethodAtEnd(transaction, fields)
    await setContactMethodSections(transaction, created.id, sections)
    return created
  })
  return { ...method, sections }
}

export async function updateContactMethod(id: number, input: ContactMethodInput) {
  const { kind, title, value, sections } = input
  const fields = { kind, title, value }
  const method = await runInTransaction(async (transaction) => {
    const updated = assertFound(
      await updateContactMethodRow(transaction, id, fields),
      'Contact method',
    )
    await setContactMethodSections(transaction, id, sections)
    return updated
  })
  return { ...method, sections }
}

export async function deleteContactMethod(id: number) {
  if (!(await deleteContactMethodRow(id))) throw new NotFoundError('Contact method')
}

export async function reorderContactMethods(ids: number[]) {
  const order = ids
  await runInTransaction(async (transaction) => {
    const existing = new Set(await listContactMethodIds(transaction))
    if (order.some((id) => !existing.has(id))) {
      throw new ValidationError('Order contains items that do not exist')
    }
    await setContactMethodOrder(transaction, order)
  })
}

export async function createSocialLink(input: SocialLinkInput) {
  return socialLinkRepo.append(input)
}

export async function updateSocialLink(id: number, input: SocialLinkInput) {
  return assertFound(await socialLinkRepo.update(id, input), 'Social link')
}

export async function deleteSocialLink(id: number) {
  if (!(await socialLinkRepo.remove(id))) throw new NotFoundError('Social link')
}

export async function reorderSocialLinks(ids: number[]) {
  await socialLinkRepo.reorder(ids)
}
