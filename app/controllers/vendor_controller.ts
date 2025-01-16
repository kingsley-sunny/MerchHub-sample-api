import type { HttpContext } from '@adonisjs/core/http'
import User from '../models/user.js'
import Vendor from '../models/vendor.js'
import { createVendorValidator } from '../validators/vendor.js'
import { BaseController } from './base_controller.js'

export default class VendorsController extends BaseController {
  async register(ctx: HttpContext) {
    // validate the body from the request
    const data = await ctx.request.validateUsing(createVendorValidator)
    // check if the user is a vendor before
    const user = ctx.auth.user as User
    if (user && user.is_vendor) {
      return ctx.response.conflict('User is already a vendor')
    }
    // set email if there is no email
    const vendor = new Vendor()
    if (!data.email) {
      vendor.email = user.email
    }
    // save to database
    vendor.merge(data)
    vendor.user_id = user.id
    await vendor.save()
    // update the user is vendor profile
    await user.related('roles').attach([3])
    // return the vendor
    return this.transformResponse(vendor, 'Vendor created successfully', 201)
  }
}
