import express from 'express'
const router = express.Router()
import orderController from '../controller/orderControler.js'
import {isauthenticated,authorizrRoles,ISAuthenticated,ISAUthenticated ,ISauthenticated ,Isauthenticated}from '../middleware/auth.js'
import orderModel from '../model/orderModel.js'
// Order create
router.post('/order/new',ISAUthenticated,orderController.neworder)

// Get single order
router.get('/order/:id',orderController.getsingleorder)

// looged user order detail
router.get('/orders/me',ISAuthenticated,orderController.myorder)

// get product total price
router.get('/admin/orders',orderController.getAllOrders)


// get  order sales
router.get('/admin/sale/order',orderController.calculateSales)


// update orderStatus
router.put('/admin/orders/:id',ISAUthenticated,authorizrRoles('admin','manger'),orderController.updateorderstatus)

// Delete order
router.delete('/admin/order/:id',isauthenticated,authorizrRoles('admin'),orderController.deleteorder)

router.put('/rider/order/pick/:id',Isauthenticated,orderController.orderpick)

// Rider Eraining 
router.get('/rider/earn/order',isauthenticated,orderController.calculateRiderEarnings)

export default router