import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'
import Collection from '../models/collection.js'
import { FileService } from '../services/file_service.js'
import { createCollectionValidator } from '../validators/collection.js'
import { BaseController } from './base_controller.js'

@inject()
export default class CollectionController extends BaseController {
  constructor(protected readonly fileService: FileService) {
    super()
  }
  async create({ request }: HttpContext) {
    const { name, image_url, file } = await request.validateUsing(createCollectionValidator)

    // if the name exist throw an error
    const existingCollection = await Collection.query().where('name', name.toLowerCase()).first()
    if (existingCollection)
      throw new Exception('Collection already exist', { status: 300, code: 'CONFLICT' })

    // save image_url if there is not a file
    const collection = new Collection()
    if (file) {
      const { url } = await this.fileService.upload(file)
      collection.image_url = url
    } else if (image_url) {
      collection.image_url = image_url
    }

    collection.merge({ name })
    collection.save()

    return this.transformResponse(collection.serialize(), 'Collection created successfully', 201)
  }

  async findAll({ request }: HttpContext) {
    const { search, page, limit, orderBy } = request.qs()
    const collectionQuery = Collection.query()

    if (search) {
      collectionQuery.where('name', 'like', `%${search}%`)
    }

    if (orderBy) {
      collectionQuery.orderBy('created_at', orderBy)
    }

    console.log(collectionQuery.toSQL().sql)
    const products = await collectionQuery.paginate(page, limit)

    return this.transformResponse(products, 'Products fetched successfully', 200)
  }

  async getTopCollections({ request }: HttpContext) {
    const { page, limit } = request.qs()

    // for now, we are recommending top collections by number of products they have, An idea way is to get the collections by the number of orders on their products
    const collectionQuery = Collection.query()
      .withCount('products')
      .orderBy('products_count', 'desc')

    console.log(collectionQuery.toSQL().sql)

    const collections = await collectionQuery.paginate(page, limit)

    return this.transformResponse(collections, 'Top Collections fetched successfully', 200)
  }
}
