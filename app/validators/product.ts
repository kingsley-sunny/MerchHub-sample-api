import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'
import { FIVE_MB } from '../base/base_constant.js'

const validWhenDiscountIsLowerThanPrice = vine.createRule(
  async (value, options, field: FieldContext) => {
    if (value && value < field.parent.price) return true
  }
)

/**
 * Validator to validate the payload when creating
 * a new product.
 */
export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string(),
    description: vine.string().minLength(5).optional(),
    collection_ids: vine.array(vine.number().exists({ table: 'collections', column: 'id' })),
    price: vine.number().min(1),
    quantity: vine.number().min(1).optional(),
    discount_price: vine.number().min(1).optional().use(validWhenDiscountIsLowerThanPrice()),
    file: vine.file({ extnames: ['jpg', 'png', 'jpeg', 'webp'], size: FIVE_MB }).optional(),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing product.
 */
export const updateProductValidator = vine.compile(vine.object({}))
