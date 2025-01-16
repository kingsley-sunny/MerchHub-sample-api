import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import User from '../models/user.js'
import UserRole from '../models/user_role.js'
import { loginUserValidator, registerUserValidator } from '../validators/auth.js'
import { BaseController } from './base_controller.js'

export default class AuthController extends BaseController {
  async register(ctx: HttpContext) {
    // validate the inputs
    const data = await ctx.request.validateUsing(registerUserValidator)

    let newUser = await db.transaction(async (trx) => {
      const user = new User()
      user.useTransaction(trx)

      user.full_name = data.full_name
      user.email = data.email //Note: Normally i would have checked if the email already exists, but i already did that in the user validation
      user.password = data.password //NOtE:  Normally, I would have hast the password, but i already set it up automatically in the user model

      // save the user
      await user.save()
      console.log('user', user)

      // Attached the user role (defaults to user, which is 4)
      await UserRole.create({ role_id: 4, user_id: user.id }, { client: trx })

      return user
    })

    return this.transformResponse(newUser.serialize(), 'User created successfully', 201)
  }

  async login(ctx: HttpContext) {
    // validate the user (which is the email and password)
    const { email, password } = await ctx.request.validateUsing(loginUserValidator)

    // check if the user is exist and if the password is the same
    let user = await User.verifyCredentials(email, password)

    await user.preload('roles')
    await user.load('vendor')

    // create an access token and assign it to the user
    const token = await User.accessTokens.create(user)

    // return the user
    return this.transformResponse({
      user,
      token: token.value?.release(),
    })
  }
}
