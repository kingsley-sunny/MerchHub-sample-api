import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Collection from './collection.js'
import Vendor from './vendor.js'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare price: number

  @column()
  declare discount_price: number

  @column()
  declare image_url: string

  @column()
  declare vendor_id: number

  @column()
  declare quantity: number

  @belongsTo(() => Vendor)
  declare vendor: BelongsTo<typeof Vendor>

  @manyToMany(() => Collection, {
    pivotTable: 'product_collections',
    localKey: 'id',
    pivotForeignKey: 'product_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'collection_id',
  })
  declare collections: ManyToMany<typeof Collection>

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime
}
