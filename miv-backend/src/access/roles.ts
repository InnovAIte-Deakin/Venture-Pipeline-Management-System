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

// NOTE: `selfOrAdminAccess` and `founderOfVenture` were removed (review cleanup).
// `founderOfVenture` was broken — it resolved a user's ventures through
// `ventures.founders[].user`, an embedded array field that has no `user` sub-field, so it
// denied every founder. Founder/self scoping now lives in `access/scoping.ts`
// (`founderVentureScopedRead`, `founderOwnVenturesRead`, `selfOrStaffRead`), which resolves
// through the `founders` collection instead.
