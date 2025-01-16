import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Product from '../models/product.js'
import { FileService } from '../services/file_service.js'
import { createProductValidator } from '../validators/product.js'
import { BaseController } from './base_controller.js'

@inject()
export default class ProductsController extends BaseController {
  /**
   * Display a list of resource
   */
  constructor(protected readonly fileService: FileService) {
    super()
  }
  async findAll({ request }: HttpContext) {
    const { search, priceRange, page, limit, orderBy } = request.qs()
    const productQuery = Product.query()

    productQuery.preload('vendor')
    productQuery.preload('collections')

    if (search) {
      productQuery
        .where('name', 'like', `%${search}%`)
        .orWhereHas('collections', (builder) => builder.where('name', 'like', `%${search}%`))
    }

    if (priceRange) {
      const [min, max] = priceRange
      productQuery.andWhereBetween('price', [min, max])
    }

    if (orderBy) {
      productQuery.orderBy('created_at', orderBy)
    }

    console.log(productQuery.toSQL().sql)
    const products = await productQuery.paginate(page, limit)

    return this.transformResponse(products, 'Products fetched successfully', 200)
  }

  /**
   * Handle form submission for the create action
   */
  async create({ request, auth }: HttpContext) {
    // validate the body
    const { collection_ids, file, ...data } = await request.validateUsing(createProductValidator)

    let finalProduct = await db.transaction(async (trx) => {
      let product = new Product()

      product.useTransaction(trx)
      await auth.user?.preload('vendor')

      // save the image
      if (file) {
        const { url } = await this.fileService.upload(file)
        product.image_url = url
      }
      product.merge({ ...data, vendor_id: auth.user?.vendor.id })
      // save the product
      await product.save()

      // attach the collections to the product
      await product.related('collections').attach(collection_ids, trx)

      return product
    })

    return this.transformResponse(finalProduct.serialize(), 'Product created successfully', 201)
  }

  /**
   * Show individual record
   */
  async findOne({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async delete({ params }: HttpContext) {}
}
