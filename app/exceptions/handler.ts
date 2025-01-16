import { ExceptionHandler, HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = false

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: any, ctx: HttpContext) {
    console.log('🚀 ~~ HttpExceptionHandler ~~ handle ~~ error:', error)

    if (error instanceof errors.E_VALIDATION_ERROR) {
      return ctx.response.status(error.status).send({
        message: error.messages,
        statuscode: error.status,
        code: error.code,
        error: true,
        name: error.message,
      })
    }

    return ctx.response.status(error.status).send({
      message: error.message,
      statuscode: error.status,
      code: error.code,
      error: true,
      name: error.name,
    })
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
