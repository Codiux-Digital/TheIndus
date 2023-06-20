import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    shippingInfo:{
        address:{
            type:String,
            required:true
        },
        address2:{
            type:String,
        },
        city:{
            type:String,
            required:true
        },
        pincode:{
            type:Number,
            required:true
        },
        phoneNo:{
            type:Number,
            required:true
        }
    },
    orderItem:[
    {
        name:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        special_ins:{
            type:String,
        },
        product:{ 
            type:mongoose.Schema.ObjectId,
            ref:"product",
            required:true
        }
    }
],
user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
rider: {
    type: mongoose.Schema.ObjectId,
    ref: "user",   //Table name  
},

paymentInfo:{
    id:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
},
 paidAt:{
    type:Date,
    required:true
 },
 itemPrice:{
    type:Number,
    default: 0,
    required:true
 },
 taxPrice:{ type:Number,
    default: 0,
    required:true
},
shippingPrice:{
    type:Number,
    default: 0,
    required:true
},
totalPrice:{
    type:Number,    
    required:true
},
orderStatus:{
    type:String,
    default:"Processing",
    required:true
},
deliverAt:Date,
createdAt: {
    type: Date,
    default: Date.now,
  },

})

const orderModel=mongoose.model('orders',orderSchema)

export default orderModel