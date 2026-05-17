/**
 * Role-based access control system for Vanguard XI
 */

// Role hierarchy (lower number = higher privilege)
export const ROLES = {
  ADMIN: { level: 0, name: 'admin', label: 'Admin' },
  CAPTAIN: { level: 1, name: 'captain', label: 'Captain' },
  VICE_CAPTAIN: { level: 2, name: 'vice_captain', label: 'Vice Captain' },
  PLAYER: { level: 3, name: 'player', label: 'Player' },
}

// Role permissions matrix
export const PERMISSIONS = {
  // Team Management
  MANAGE_TEAM: ['admin', 'captain'],
  ASSIGN_ROLES: ['admin', 'captain'],
  MANAGE_PLAYERS: ['admin', 'captain', 'vice_captain'],
  
  // Match Management
  CREATE_MATCH: ['admin', 'captain'],
  EDIT_MATCH: ['admin', 'captain', 'vice_captain'],
  MANAGE_FORMATIONS: ['admin', 'captain'],
  
  // Communications
  CREATE_CALLUPS: ['admin', 'captain'],
  CREATE_ANNOUNCEMENTS: ['admin', 'captain', 'vice_captain'],
  MANAGE_ANNOUNCEMENTS: ['admin', 'captain'],
  
  // Statistics & Analytics
  VIEW_STATS: ['admin', 'captain', 'vice_captain', 'player'],
  UPLOAD_STATS: ['admin', 'captain', 'vice_captain'],
  
  // Settings
  ACCESS_SETTINGS: ['admin', 'captain'],
  CAPTAIN_DASHBOARD: ['admin', 'captain'],
}

/**
 * Check if a user has a specific permission
 * @param {string} userRole - User's role name
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export function hasPermission(userRole, permission) {
  if (!userRole) return false
  const allowedRoles = PERMISSIONS[permission] || []
  return allowedRoles.includes(userRole)
}

/**
 * Check if user role is equal or higher in hierarchy
 * @param {string} userRole - User's role name
 * @param {string} requiredRole - Minimum required role name
 * @returns {boolean}
 */
export function hasRole(userRole, requiredRole) {
  if (!userRole || !requiredRole) return false
  const userRoleObj = Object.values(ROLES).find(r => r.name === userRole)
  const requiredRoleObj = Object.values(ROLES).find(r => r.name === requiredRole)
  
  if (!userRoleObj || !requiredRoleObj) return false
  
  // Lower level = higher privilege
  return userRoleObj.level <= requiredRoleObj.level
}

/**
 * Get role display label
 * @param {string} roleName - Role name
 * @returns {string}
 */
export function getRoleLabel(roleName) {
  const role = Object.values(ROLES).find(r => r.name === roleName)
  return role?.label || 'Unknown'
}

/**
 * Get all roles
 * @returns {Array}
 */
export function getAllRoles() {
  return Object.values(ROLES).map(r => ({ name: r.name, label: r.label }))
}
