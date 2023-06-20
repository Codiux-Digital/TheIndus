import catchAsyncError from "../middleware/catch.js";
import stripePackage from "stripe";
import dotenv from 'dotenv';

dotenv.config({path:'beckend/config/config.env'})

const stripe = stripePackage(process.env.SRTIPE_SECRET_KEY);

// console.log(process.env.SRTIPE_SECRET_KEY);

const processpayment = catchAsyncError(async (req, res, next) => {
  
  const mypayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: 'inr',
    metadata: {
      company: 'The_Indus',
    },
  });
  res.status(200).json({ success: true, client_secret: mypayment.client_secret });
});

const sendstripkey = catchAsyncError(async (req, res, next) => {
    res.status(200).json({sendstripkey:process.env.STRIPE_API_KEY});
});

export{processpayment , sendstripkey};
