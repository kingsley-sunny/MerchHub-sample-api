export enum UserRoleEnum {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  USER = 'USER',
  VENDOR = 'VENDOR',
}

export interface ResponseType<T extends any = any> {
  statuscode: number
  message: string
  data: T
  timestamp: number | string
}
