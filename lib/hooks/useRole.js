import { useUser } from './useUser'
import { hasRole, hasPermission, getRoleLabel, ROLES } from '@/lib/auth/roles'

/**
 * Hook to access and check user role
 * @returns {Object} Object with user role info and permission checking functions
 */
export function useRole() {
  const { user } = useUser()

  const roleName = user?.user_metadata?.role_name || 'player'
  const roleLevel = user?.user_metadata?.role_level || 3

  return {
    // Current role info
    roleName,
    roleLevel,
    roleLabel: getRoleLabel(roleName),
    
    // Check functions
    isCaptain: () => hasRole(roleName, 'captain'),
    isViceCaptain: () => hasRole(roleName, 'vice_captain'),
    isAdmin: () => hasRole(roleName, 'admin'),
    isPlayer: () => roleName === 'player',
    
    // Generic check
    hasRole: (requiredRole) => hasRole(roleName, requiredRole),
    hasPermission: (permission) => hasPermission(roleName, permission),
    
    // All roles
    allRoles: Object.values(ROLES),
  }
}
