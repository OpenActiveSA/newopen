// User role definitions (same as web app)
export const USER_ROLES = {
  OPENACTIVE_USER: 'openactive_user',    // Super user
  CLUB_MANAGER: 'club_manager',         // Club admin
  MEMBER: 'member',                     // Club member
  VISITOR: 'visitor'                    // Club visitor
}

// User permissions by role (same as web app)
export const USER_PERMISSIONS = {
  [USER_ROLES.OPENACTIVE_USER]: {
    canManageAllClubs: true,
    canCreateClubs: true,
    canDeleteClubs: true,
    canManageUsers: true,
    canAccessAdmin: true,
    canManageClubSettings: true,
    canViewAllData: true
  },
  [USER_ROLES.CLUB_MANAGER]: {
    canManageClub: true,
    canManageClubMembers: true,
    canAccessClubAdmin: true,
    canManageClubSettings: true,
    canViewClubData: true,
    canInviteMembers: true
  },
  [USER_ROLES.MEMBER]: {
    canViewClubContent: true,
    canParticipateInActivities: true,
    canViewMemberDirectory: true,
    canUpdateProfile: true
  },
  [USER_ROLES.VISITOR]: {
    canViewPublicClubContent: true,
    canRegisterForEvents: true,
    canViewBasicClubInfo: true
  }
}

// Club relationship types (same as web app)
export const CLUB_RELATIONSHIP_TYPES = {
  MANAGER: 'manager',
  MEMBER: 'member', 
  VISITOR: 'visitor'
}









