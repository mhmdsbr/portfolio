import { asc } from 'drizzle-orm'
import * as schema from '@/server/db/schema'
import { defaultExecutor, type DbExecutor } from './executor'

export async function listSocialLinks(executor: DbExecutor = defaultExecutor) {
  return executor
    .select({
      platform: schema.socialLinks.platform,
      url: schema.socialLinks.url,
    })
    .from(schema.socialLinks)
    .orderBy(asc(schema.socialLinks.sortOrder), asc(schema.socialLinks.id))
}
