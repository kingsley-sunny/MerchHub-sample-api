import vine from '@vinejs/vine'
import { ALLOWED_FILE_TYPES, FIVE_MB } from '../base/base_constant.js'

/**
 * Validator to validate the payload when creating
 * a new collection.
 */
export const createCollectionValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .minLength(3)
      .transform((value) => value.toLowerCase()),
    file: vine
      .file({ extnames: ALLOWED_FILE_TYPES, size: FIVE_MB })
      .optional()
      .requiredWhen('image_url', '=', false),
    image_url: vine.string().url().optional().requiredWhen('file', '=', false),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing collection.
 */
export const updateCollectionValidator = vine.compile(vine.object({}))
