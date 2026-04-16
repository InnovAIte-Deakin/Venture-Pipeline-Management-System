import type { AccessArgs } from 'payload'

type AppRole = 'admin' | 'founder' | 'miv_analyst' | string | undefined

const getRole = ({ req }: AccessArgs): AppRole => {
  return req.user?.role
}

export const isLoggedIn = ({ req }: AccessArgs) => {
  return Boolean(req.user)
}

export const isAdmin = (args: AccessArgs) => {
  return getRole(args) === 'admin'
}

export const isAnalystOrAdmin = (args: AccessArgs) => {
  const role = getRole(args)
  return role === 'admin' || role === 'miv_analyst'
}

export const isFounder = (args: AccessArgs) => {
  return getRole(args) === 'founder'
}

export const canReadInternalFields = (args: AccessArgs) => {
  const role = getRole(args)
  return role === 'admin' || role === 'miv_analyst'
}