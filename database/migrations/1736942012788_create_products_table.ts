import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name').notNullable()
      table.string('image_url').nullable()
      table.text('description').nullable()
      table.decimal('price', 10, 2).notNullable()
      table.decimal('discount_price', 10, 2).nullable()
      table.integer('quantity').notNullable().defaultTo(1)

      table
        .integer('vendor_id')
        .unsigned()
        .references('id')
        .inTable('vendors')
        .onDelete('CASCADE')
        .notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
