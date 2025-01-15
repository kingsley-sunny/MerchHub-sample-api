import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '../../app/models/role.js'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await Role.createMany([
      { name: 'ADMIN', id: 1 },
      { name: 'OWNER', id: 2 },
      { name: 'USER', id: 3 },
    ])
  }
}
