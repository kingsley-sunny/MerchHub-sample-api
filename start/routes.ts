/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { UserRoleEnum } from '../app/base/types/types.js'
import { middleware } from './kernel.js'
const ProductsController = () => import('../app/controllers/product_controller.js')
const AuthController = () => import('../app/controllers/auth_controller.js')
const VendorsController = () => import('../app/controllers/vendor_controller.js')

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

// products routes
router
  .group(() => {
    router
      .post('/', [ProductsController, 'create'])
      .use([middleware.auth({ guards: ['api'] }), middleware.allowRole([UserRoleEnum.VENDOR])])

    // get products
    router.get('/', [ProductsController, 'findAll'])
  })
  .prefix('/products')
