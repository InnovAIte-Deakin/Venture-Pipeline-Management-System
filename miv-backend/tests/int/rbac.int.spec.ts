import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, afterAll, expect } from 'vitest'

/**
 * RBAC access-rule tests (#77 enforcement).
 *
 * Exercises each collection's create/read/update/delete for admin / miv_analyst /
 * founder / anonymous through the Local API with `overrideAccess: false` + the acting
 * user — the same path the app should use — and the founder venture-scoping (founder sees
 * only their own venture, and cannot self-link to another).
 *
 * NOTE: like the existing api.int.spec.ts, this is an INTEGRATION test — it needs a live
 * DATABASE_URI (Mongo) from .env. It does not run in CI yet (main only has
 * sync-upstream.yml; the pipeline is #56). Run locally with `pnpm run test:int`.
 *
 * Expectations follow the CURRENT code after #77, which in places is stricter than the
 * pre-#77 snapshot in docs/rbac/RBAC_MATRIX.md §2 (e.g. users.read is self-or-staff, not a
 * flat deny; founders.create is staff-only).
 */

let payload: Payload

// Test fixtures
let admin: any, analyst: any, founder: any
let ventureA: any, ventureB: any

const S = Date.now()
const asUser = (user: any) => ({ user, overrideAccess: false as const })

/** Assert an operation is denied (Payload throws Forbidden when access returns false). */
async function denied(fn: () => Promise<unknown>) {
  await expect(fn()).rejects.toThrow()
}

describe('RBAC access rules (#77)', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })

    const mkUser = (tag: string, role: 'admin' | 'miv_analyst' | 'founder') =>
      payload.create({
        collection: 'users',
        overrideAccess: true,
        data: {
          email: `rbac-${tag}-${S}@test.local`,
          password: 'Test1234!',
          first_name: 'RBAC',
          last_name: tag,
          role,
        } as any,
      })

    admin = await mkUser('admin', 'admin')
    analyst = await mkUser('analyst', 'miv_analyst')
    founder = await mkUser('founder', 'founder')

    ventureA = await payload.create({
      collection: 'ventures',
      overrideAccess: true,
      data: { name: `A-${S}`, country: 'KH', city: 'Phnom Penh', sector: 'agri' } as any,
    })
    ventureB = await payload.create({
      collection: 'ventures',
      overrideAccess: true,
      data: { name: `B-${S}`, country: 'VN', city: 'Hanoi', sector: 'climate' } as any,
    })

    // Link the founder to ventureA via the founders collection (email match, lowercased by hook)
    await payload.create({
      collection: 'founders',
      overrideAccess: true,
      data: { fullName: 'Demo Founder', email: founder.email, venture: ventureA.id } as any,
    })
  })

  afterAll(async () => {
    const cleanup = async (collection: any, ids: string[]) => {
      for (const id of ids) {
        try {
          await payload.delete({ collection, id, overrideAccess: true })
        } catch {
          /* ignore */
        }
      }
    }
    // founders link is removed via the venture cascade-free delete; find + remove by email
    const fRows = await payload.find({
      collection: 'founders',
      where: { email: { equals: founder?.email } },
      overrideAccess: true,
      limit: 10,
    })
    await cleanup('founders', fRows.docs.map((d: any) => d.id))
    await cleanup('ventures', [ventureA?.id, ventureB?.id].filter(Boolean))
    await cleanup('users', [admin?.id, analyst?.id, founder?.id].filter(Boolean))
  })

  // ---- users ----
  describe('users', () => {
    it('create: anon and non-admins denied, admin allowed', async () => {
      await denied(() =>
        payload.create({
          collection: 'users',
          overrideAccess: false,
          data: { email: `x-${S}@t.local`, password: 'Test1234!', first_name: 'x', last_name: 'y', role: 'founder' } as any,
        }),
      )
      await denied(() =>
        payload.create({
          collection: 'users',
          ...asUser(analyst),
          data: { email: `x2-${S}@t.local`, password: 'Test1234!', first_name: 'x', last_name: 'y', role: 'founder' } as any,
        }),
      )
      const created = await payload.create({
        collection: 'users',
        ...asUser(admin),
        data: { email: `okadmin-${S}@t.local`, password: 'Test1234!', first_name: 'x', last_name: 'y', role: 'founder' } as any,
      })
      expect(created.id).toBeDefined()
      await payload.delete({ collection: 'users', id: created.id, overrideAccess: true })
    })

    it('read: founder sees only their own record; staff see all', async () => {
      const asFounder = await payload.find({ collection: 'users', ...asUser(founder) })
      expect(asFounder.docs.every((u: any) => u.id === founder.id)).toBe(true)
      const asAdmin = await payload.find({ collection: 'users', ...asUser(admin) })
      expect(asAdmin.totalDocs).toBeGreaterThan(1)
    })

    it('role field is admin-only: analyst cannot escalate a user (A2)', async () => {
      await payload.update({ collection: 'users', id: founder.id, ...asUser(analyst), data: { role: 'admin' } as any })
      const after = await payload.findByID({ collection: 'users', id: founder.id, overrideAccess: true })
      expect(after.role).toBe('founder') // role write stripped for analyst
    })

    it('delete: analyst denied, admin allowed', async () => {
      const tmp = await payload.create({
        collection: 'users',
        overrideAccess: true,
        data: { email: `del-${S}@t.local`, password: 'Test1234!', first_name: 'x', last_name: 'y', role: 'founder' } as any,
      })
      await denied(() => payload.delete({ collection: 'users', id: tmp.id, ...asUser(analyst) }))
      await payload.delete({ collection: 'users', id: tmp.id, ...asUser(admin) })
    })
  })

  // ---- ventures (founder scoping / finding 1 & 2) ----
  describe('ventures', () => {
    it('founder reads only their own venture; admin reads all', async () => {
      const asFounder = await payload.find({ collection: 'ventures', ...asUser(founder) })
      const ids = asFounder.docs.map((d: any) => d.id)
      expect(ids).toContain(ventureA.id)
      expect(ids).not.toContain(ventureB.id)

      const asAdmin = await payload.find({ collection: 'ventures', ...asUser(admin) })
      const adminIds = asAdmin.docs.map((d: any) => d.id)
      expect(adminIds).toContain(ventureA.id)
      expect(adminIds).toContain(ventureB.id)
    })

    it('founder cannot update another venture', async () => {
      await denied(() =>
        payload.update({ collection: 'ventures', id: ventureB.id, ...asUser(founder), data: { city: 'hacked' } as any }),
      )
    })
  })

  // ---- founders (finding 2: scoping key is not self-servable) ----
  describe('founders', () => {
    it('founder cannot self-create a founders row (create is staff-only)', async () => {
      await denied(() =>
        payload.create({
          collection: 'founders',
          ...asUser(founder),
          data: { fullName: 'sneaky', email: founder.email, venture: ventureB.id } as any,
        }),
      )
    })

    it('founder reads only founder rows for their own venture', async () => {
      const res = await payload.find({ collection: 'founders', ...asUser(founder) })
      expect(res.docs.every((d: any) => String((d.venture as any)?.id ?? d.venture) === String(ventureA.id))).toBe(true)
    })
  })

  // ---- activityLogs (A7: fully immutable) ----
  describe('activityLogs', () => {
    it('no update and no delete via the API, admin included', async () => {
      const log = await payload.create({
        collection: 'activityLogs',
        overrideAccess: true,
        data: { action: 'test', entity: 'unit', actor: admin.id } as any,
      })
      await denied(() => payload.update({ collection: 'activityLogs', id: log.id, ...asUser(admin), data: { action: 'edited' } as any }))
      await denied(() => payload.delete({ collection: 'activityLogs', id: log.id, ...asUser(admin) }))
      await payload.delete({ collection: 'activityLogs', id: log.id, overrideAccess: true }) // cleanup (bypass)
    })
  })

  // ---- settings global (A8: auth read, admin-only write) ----
  describe('settings global', () => {
    it('anon read denied; founder read allowed; only admin can update', async () => {
      await denied(() => payload.findGlobal({ slug: 'settings', overrideAccess: false }))
      const asFounder = await payload.findGlobal({ slug: 'settings', ...asUser(founder) })
      expect(asFounder).toBeDefined()
      await denied(() => payload.updateGlobal({ slug: 'settings', ...asUser(founder), data: { enableSlack: true } as any }))
      const updated = await payload.updateGlobal({ slug: 'settings', ...asUser(admin), data: { enableSlack: true } as any })
      expect(updated).toBeDefined()
    })
  })
})
