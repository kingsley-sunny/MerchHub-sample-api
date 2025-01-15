/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const AuthController = () => import('../app/controllers/auth_controller.js')
const VendorsController = () => import('../app/controllers/vendors_controller.js')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Auth Routes
router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
  })
  .prefix('auth')

// vendor routes
router
  .group(() => {
    router.post('/apply', [VendorsController, 'register'])
  })
  .prefix('vendors')
  .use(middleware.auth({ guards: ['api'] }))
