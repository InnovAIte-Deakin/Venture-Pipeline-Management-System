import type { Access } from 'payload'

export const isAuthenticated: Access = ({ req }) => Boolean(req.user)

export const isAdmin = ({ req }: { req: any }) =>
  Boolean(req.user && (req.user as any).role === 'admin')
export const isAnalyst = ({ req }: { req: any }) =>
  Boolean(req.user && (req.user as any).role === 'miv_analyst')
export const isFounder = ({ req }: { req: any }) =>
  Boolean(req.user && (req.user as any).role === 'founder')

export const adminOnly: Access = (args) => isAdmin(args)
export const adminOnlyBool = ({ req }: { req: any }) => isAdmin({ req })
export const adminOrAnalyst: Access = (args) => isAdmin(args) || isAnalyst(args)

// Founder can only access own user doc
export const selfOrAdminAccess: Access = ({ req, id }: { req: any; id?: string | number }) => {
  if (!req.user) return false
  if ((req.user as any).role === 'admin') return true
  return (req.user as any).id === id
}

// Utility to check if current user is linked to a venture (via founders relation on venture)
export const founderOfVenture =
  (ventureIdField = 'venture'): Access =>
  async ({ req, data, id }: any) => {
    if (!req.user) return false
    if ((req.user as any).role === 'admin' || (req.user as any).role === 'miv_analyst') return true
    const ventureId = (data?.[ventureIdField] as string) || id
    if (!ventureId) return false
    const payload = (req as any).payload
    const venture = await payload.findByID({ collection: 'ventures', id: ventureId })
    if (!venture) return false
    const founderUsers: string[] = (venture.founders || [])
      .map((f: { user: string | { id: string } }) =>
        typeof (f as any).user === 'object' ? (f as any).user?.id : (f as any).user,
      )
      .filter(Boolean)
    return founderUsers.includes((req.user as any).id)
  }
