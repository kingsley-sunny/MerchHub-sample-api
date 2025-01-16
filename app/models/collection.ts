import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Product from './product.js'

export default class Collection extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare image_url: string

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  // relations
  @manyToMany(() => Product, {
    pivotTable: 'product_collections',
    localKey: 'id',
    pivotForeignKey: 'collection_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'product_id',
  })
  declare products: ManyToMany<typeof Product>
}
