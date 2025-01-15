import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Collection from '../../app/models/collection.js'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await Collection.createMany([
      {
        id: 1,
        name: 'T-Shirt',
        image_url: 'https://i.imgur.com/mp3rUty.jpeg',
      },
      {
        id: 2,
        name: 'Polo',
        image_url: 'https://i.imgur.com/QkIa5tT.jpeg',
      },
      {
        id: 3,
        name: 'Vest',
        image_url: 'https://i.imgur.com/R3iobJA.jpeg',
      },
      {
        id: 4,
        name: 'Hoodie',
        image_url: 'https://i.imgur.com/R2PN9Wq.jpeg',
      },
    ])
  }
}
