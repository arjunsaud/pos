export enum USER_STATUS {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  TENANT = 'TENANT',
  USER = 'USER',
}

/** Account table used for login. Superadmin never shares the users table. */
export enum ACCOUNT_KIND {
  SUPERADMIN = 'SUPERADMIN',
  TENANT = 'TENANT',
}
