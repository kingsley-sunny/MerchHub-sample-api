import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { ModelQueryBuilder } from '@adonisjs/lucid/orm'
import { UserRoleEnum } from '../base/types/types.js'

@inject()
export default class AllowRoleMiddleware {
  constructor() {}

  async handle(ctx: HttpContext, next: NextFn, roles: UserRoleEnum[]) {
    console.log('🚀 ~~ AllowRoleMiddleware ~~ handle ~~ roles:', roles)

    /**
     * Middleware logic goes here (before the next call)
     */

    const user = ctx.auth.user

    if (!user) {
      throw new Exception('User not authorized', {
        status: 401,
        code: 'UNAUTHORIZED',
      })
    }

    await user.preload('roles', (builder: ModelQueryBuilder) => {
      builder.whereIn('name', roles)
    })

    //

    if (!user.roles.length) {
      throw new Exception('You cannot access this resource', {
        status: 401,
        code: 'UNAUTHORIZED',
      })
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
