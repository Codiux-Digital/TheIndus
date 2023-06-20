import express from 'express'
import {processpayment , sendstripkey} from '../controller/paymentController.js'
const router = express.Router()
import {isauthenticated,ISAuthenticated,Isauthenticated,ISAUthenticated }from '../middleware/auth.js'


router.post('/payment/process',ISAUthenticated, processpayment)
router.get('/stripekey',isauthenticated, sendstripkey)
export default router
