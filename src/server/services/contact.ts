import type { ContactMethodKind, ContactMethodSectionKind } from '@/lib/db/constants'
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

export interface ContactMethodInput {
  kind: ContactMethodKind
  title: string
  value: string
  sections: ContactMethodSectionKind[]
}


export async function getContact() {
  const [{ section, config }, contactMethods] = await Promise.all([
    requireSection('contact'),
    getContactMethodsWithSections(),
  ])
  return { section, config, contactMethods }
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
