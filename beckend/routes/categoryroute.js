import express from 'express'
const router = express.Router()
import categoryController from '../controller/categoryControler.js'


// Order create
router.post('/category/new', categoryController.createCategory)

// category get
router.get('/category/get', categoryController.allCategories)

// category update
router.put('/category/update/:id', categoryController.updateCategories)

// category delete
router.delete('/category/delete/:id', categoryController.deleteCategories)


export default router