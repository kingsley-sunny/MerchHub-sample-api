import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Product from '../models/product.js'
import { FileService } from '../services/file_service.js'
import { createProductValidator, updateProductValidator } from '../validators/product.js'
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
  async findOne({ params }: HttpContext) {
    const id = params.id
    const product = await Product.query()
      .where({ id })
      .preload('collections')
      .preload('vendor')
      .first()

    if (!product) {
      throw new Exception('Product not found', { status: 404, code: 'NOT_FOUND' })
    }

    return this.transformResponse(product, 'Product fetched successfully', 200)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, auth }: HttpContext) {
    const { collection_ids, file, ...data } = await request.validateUsing(updateProductValidator)

    // check if the product exists
    let product = await Product.findOrFail(params.id)
    await auth.user?.preload('vendor')

    // check if the product belongs to the user
    if (product.vendor_id !== auth.user?.vendor.id) {
      throw new Exception('You are not the owner of this product', {
        status: 403,
        code: 'FORBIDDEN',
      })
    }

    let finalProduct = await db.transaction(async (trx) => {
      product.useTransaction(trx)

      // save the image
      if (file) {
        const { url } = await this.fileService.upload(file)
        product.image_url = url
      }
      product.merge({ ...data, vendor_id: auth.user?.vendor.id })

      // attach the collections to the product
      if (collection_ids) {
        await product.related('collections').detach()
        await product.related('collections').attach(collection_ids, trx)
      }

      // save the product
      await product.save()

      return product
    })

    return this.transformResponse(finalProduct.serialize(), 'Product updated successfully', 201)
  }

  /**
   * Delete record
   */
  async delete({ params, auth }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await auth.user?.preload('vendor')

    // check if the product belongs to the user
    if (product.vendor_id !== auth.user?.vendor.id) {
      throw new Exception('You are not the owner of this product', {
        status: 403,
        code: 'FORBIDDEN',
      })
    }

    // delete the product
    await product.delete()

    return this.transformResponse(product, 'Product deleted successfully', 200)
  }
}
