import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new vendor.
 */
export const createVendorValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3),
    description: vine.string().minLength(5).optional(),
    email: vine.string().email().optional(),
    phone_no: vine.string().mobile({ locale: ['en-NG'] }),
    website: vine.string().url().optional(),

    // ....other properties
  })
)
