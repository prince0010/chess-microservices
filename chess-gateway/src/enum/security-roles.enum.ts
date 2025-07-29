export enum SecurityRoles {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  PLAYER = 'PLAYER',
  TEACHER = 'TEACHER',
  //   GUEST = 'GUEST',
}

export const securityRolesArray = Object.values(SecurityRoles);
