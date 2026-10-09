import { CONTACT_METHOD_KINDS, CONTACT_METHOD_SECTION_KINDS, type ContactMethodSectionKind } from '@/lib/db/constants'
import { parseIdList, requiredText } from '@/lib/validation'
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
import { assertFound, NotFoundError } from './shared'

export interface ContactMethodInput {
  kind: unknown
  title: unknown
  value: unknown
  sections: unknown[]
}

function parseContactMethod(input: ContactMethodInput) {
  const kind = CONTACT_METHOD_KINDS.find((candidate) => candidate === input.kind)
  if (!kind) throw new Error('Invalid contact method kind')

  const sections: ContactMethodSectionKind[] = CONTACT_METHOD_SECTION_KINDS.filter(
    (candidate) => input.sections.includes(candidate),
  )
  return {
    fields: {
      kind,
      title: requiredText(input.title, 'Contact method title'),
      value: requiredText(input.value, 'Contact method value'),
    },
    sections,
  }
}

export async function getContact() {
  const [{ section, config }, contactMethods] = await Promise.all([
    requireSection('contact'),
    getContactMethodsWithSections(),
  ])
  return { section, config, contactMethods }
}

export async function updateContactSettings(input: {
  formTitle: unknown
  buttonText: unknown
  buttonUrl: unknown
}) {
  const { config } = await updateSectionConfig('contact', input)
  return config
}

export async function createContactMethod(input: ContactMethodInput) {
  const { fields, sections } = parseContactMethod(input)
  const method = await runInTransaction(async (transaction) => {
    const created = await insertContactMethodAtEnd(transaction, fields)
    await setContactMethodSections(transaction, created.id, sections)
    return created
  })
  return { ...method, sections }
}

export async function updateContactMethod(id: number, input: ContactMethodInput) {
  const { fields, sections } = parseContactMethod(input)
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

export async function reorderContactMethods(ids: unknown) {
  const order = parseIdList(ids)
  await runInTransaction(async (transaction) => {
    const existing = new Set(await listContactMethodIds(transaction))
    if (order.some((id) => !existing.has(id))) {
      throw new Error('Order contains items that do not exist')
    }
    await setContactMethodOrder(transaction, order)
  })
}
