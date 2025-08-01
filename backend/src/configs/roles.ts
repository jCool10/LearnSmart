export type Role = 'user' | 'admin'

export type Permission = 'getUsers' | 'manageUsers' | 'manageTokens' | 'getTokens'

const allRoles: Record<Role, Permission[]> = {
  user: [],
  admin: ['getUsers', 'manageUsers', 'manageTokens', 'getTokens']
}

const roles = Object.keys(allRoles) as Role[]
const roleRights = new Map(Object.entries(allRoles)) as Map<Role, Permission[]>

export { roles, roleRights, allRoles }
