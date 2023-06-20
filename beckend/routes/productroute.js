import express from 'express'
import productController from '../controller/productController.js'
const router = express.Router()
import { isauthenticated, authorizrRoles,ISAUthenticated, Isauthenticated,ISauthenticated,ISAuthenticated, x } from '../middleware/auth.js';
// Get All products
router.get('/product',productController.getallproduct)

router.get('/products',productController.getProductsByCategory)
// Get Single product
router.get('/product/:id',productController.getsingleproduct)

// Update product
router.put('/update/product/:id',ISAUthenticated,productController.updateproduct)
// create product Admin
router.post('/admin/product/new',isauthenticated,productController.createproduct)

// Delete product
router.delete('/admin/product/:id',productController.deleteproduct)


// For admin get products
router.get("/admin/products" , productController.getAdminProducts);








export default router