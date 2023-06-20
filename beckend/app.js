import express from 'express'
import dotenv from 'dotenv'
const app =express()
import productroute from './routes/productroute.js'
import userroute from './routes/userroute.js'
import orderroute from './routes/orderroute.js'
const DATABASE_URL="mongodb://127.0.0.1:27017";
import connectDb from './db/connection.js';
import {errormiddle} from './middleware/error.js'
import cloudinary from 'cloudinary'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload'
import paymentroute from './routes/paymentroute.js'
import categoryroute from './routes/categoryroute.js'
dotenv.config({path:"beckend/config/config.env"});
// app.use(express.json())

// dotenv.config({path:'beckend/config/config.env'})
app.use(cookieParser())
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())
app.set('view engine' , 'ejs');
   
// Route connection
app.use('/api/v1',productroute)
app.use('/api/v1',userroute)
app.use('/api/v1',orderroute)
app.use('/api/v1',paymentroute)
app.use('/api/v1',categoryroute)

// Database connection 
connectDb(DATABASE_URL)
app.use(errormiddle)


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
  })
app.listen(process.env.PORT,()=>{
    console.log(`server running at ${process.env.PORT}`)
})
 