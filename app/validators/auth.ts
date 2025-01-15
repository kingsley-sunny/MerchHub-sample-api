import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new auth.
 */
export const registerUserValidator = vine.compile(
  vine.object({
    full_name: vine.string().minLength(3),
    email: vine.string().email().unique({ column: 'email', table: 'users', caseInsensitive: true }),
    password: vine.string().minLength(3),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing auth.
 */
export const loginUserValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(3),
  })
)
