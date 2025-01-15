import { inject } from '@adonisjs/core'
import { ResponseType } from '../base/types/types.js'

@inject()
export class BaseController {
  async transformResponse(
    data: Promise<Record<any, any>> | Record<any, any>,
    message = 'Successful',
    statuscode: number = 200
  ): Promise<ResponseType> {
    data = await data

    const dateTime = new Date().toISOString()
    return {
      statuscode,
      message,
      data,
      timestamp: dateTime,
    }
  }
}
