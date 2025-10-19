import { useUser } from '../context/UserContext'
import { USER_ROLES } from '../types/user.js'

// Role-based access control component
export function RoleGuard({ 
  children, 
  requiredRoles = [], 
  requiredClubRole = null, 
  clubId = null,
  fallback = null 
}) {
  const { globalRole, getClubRole, isAuthenticated } = useUser()

  // Check if user is authenticated
  if (!isAuthenticated) {
    return fallback || null
  }

  // Check global role permissions
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.includes(globalRole)
    if (!hasRequiredRole) {
      return fallback || null
    }
  }

  // Check club-specific role permissions
  if (requiredClubRole && clubId) {
    const clubRole = getClubRole(clubId)
    if (clubRole !== requiredClubRole) {
      return fallback || null
    }
  }

  return children
}

// Higher-order component for role-based access
export function withRoleGuard(WrappedComponent, options = {}) {
  return function RoleGuardedComponent(props) {
    return (
      <RoleGuard {...options}>
        <WrappedComponent {...props} />
      </RoleGuard>
    )
  }
}

// Hook for checking permissions
export function usePermissions() {
  const { globalRole, getClubRole, hasClubPermission, currentClub } = useUser()

  const hasGlobalPermission = (permission) => {
    if (globalRole === USER_ROLES.OPENACTIVE_USER) {
      return true
    }
    return false
  }

  const hasClubPermissionForCurrentClub = (permission) => {
    if (!currentClub) return false
    return hasClubPermission(currentClub.id, permission)
  }

  const canAccessAdmin = () => {
    return globalRole === USER_ROLES.OPENACTIVE_USER
  }

  const canAccessClubAdmin = (clubId = null) => {
    const targetClubId = clubId || currentClub?.id
    if (!targetClubId) return false
    
    const clubRole = getClubRole(targetClubId)
    return clubRole === CLUB_RELATIONSHIP_TYPES.MANAGER || globalRole === USER_ROLES.OPENACTIVE_USER
  }

  const canManageClub = (clubId = null) => {
    const targetClubId = clubId || currentClub?.id
    if (!targetClubId) return false
    
    return canAccessClubAdmin(targetClubId)
  }

  const canViewClubContent = (clubId = null) => {
    const targetClubId = clubId || currentClub?.id
    if (!targetClubId) return false
    
    const clubRole = getClubRole(targetClubId)
    return ['manager', 'member', 'visitor'].includes(clubRole) || globalRole === USER_ROLES.OPENACTIVE_USER
  }

  return {
    hasGlobalPermission,
    hasClubPermissionForCurrentClub,
    canAccessAdmin,
    canAccessClubAdmin,
    canManageClub,
    canViewClubContent,
    globalRole,
    currentClubRole: currentClub ? getClubRole(currentClub.id) : null
  }
}
