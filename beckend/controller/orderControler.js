import productModel from "../model/productsModel.js";
import ErrorHandler from "../utils/errorhandler.js";
import orderModel from "../model/orderModel.js";
import userModel from "../model/userModel.js";
class orderController {
  static neworder = async (req, res, next) => {
    const {
      shippingInfo,
      orderItem,
      paymentInfo,
      itemPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;
    console.log("orderitem", req.body);
    const order = await orderModel.create({
      shippingInfo,
      orderItem,
      paymentInfo,
      itemPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });
    res.status(200).json({
      success: true,
      order,
    });
  };
  // static getsingleorder = async(req,res,next)=>{
  //     try{
  //     const order = await orderModel.findById(req.params.id).populate("user","name email");
  //     if(!order){
  //         return next(new ErrorHandler("Order not found with this Id",404))
  //     }
  //     res.status(200).json({
  //         success:true,
  //         order,
  //     })
  // }
  //     catch(err){
  //         console.log(err)
  //     }
  // }
  static getsingleorder = async (req, res, next) => {
    try {
      const orders = await orderModel
        .findById(req.params.id)
        .populate("user", "name email");
      if (!orders) {
        return next(new ErrorHandler("Order not found with this Id", 404));
      }
      const { user } = orders;

      // Find other orders with the same user ID
      const userOrders = await orderModel
        .find({ user: user._id })
        .populate("user", "name email");

      // Get shipping information from one of the orders
      const shippingInfo =
        userOrders.length > 0 ? userOrders[0].shippingInfo : null;

      let totalPrice = 0;
      userOrders.forEach((singleOrder) => {
        singleOrder.orderItem.forEach((item) => {
          totalPrice += item.price;
        });
      });

      res.status(200).json({
        success: true,
        order: userOrders,
        totalPrice,
        shippingInfo,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  static orderpick = async (req, res, next) => {
    try {
      console.log("qwerty", req.params.id);
      const orderId = req.params.id;
      const riderId = req.user._id; // Assuming the rider ID is provided in the request body
      // Find the order in the database
      const order = await orderModel.findById(orderId).populate("rider");

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Update order status and set delivery time
      order.orderStatus = "Delivered";
      order.deliverAt = new Date();
      order.rider = riderId;

      // Save the updated order
      await order.save();

      // Notify the admin about the order being picked and the rider information (e.g., send an email, trigger a notification, update admin dashboard)

      res.json({ message: "Order picked and status updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error picking order", error });
    }
  };
  // Assuming you have a Rider model that represents riders in your application

  static calculateRiderEarnings = async (req, res, next) => {
    try {
      const riderId = req.user._id;
      console.log("rider_id", req.user._id);
      // Retrieve the orders picked by the rider
      const orders = await orderModel.find({ rider: riderId });
      const totalOrders = orders.length;
      console.log("qwwqw", totalOrders);
      const totalEarnings = totalOrders * 100;
      res.status(200).json({
        success: true,
        message: "Your Earining of Today",
        totalEarnings,
        totalOrders,
        orders,
      });
      return totalEarnings;
    } catch (error) {
      // Handle errors
      console.error("Error calculating rider earnings:", error);
      throw error;
    }
  };

  static myorder = async (req, res, next) => {
    try {
      const order = await orderModel.find({ user: req.user._id });
      if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
      }
      res.status(200).json({
        success: true,
        order,
      });
    } catch (err) {
      console.log(err);
    }
  };
  static getAllOrders = async (req, res, next) => {
    try {
      const orders = await orderModel.find();

      const userIds = orders.map((order) => order.user);

      const users = await userModel.find({ _id: { $in: userIds } });

      // Create a map to easily access user data by user ID
      const userMap = {};
      users.forEach((user) => {
        userMap[user._id] = user;
      });

      // Combine user data with order data
      const combinedOrders = orders.map((order) => {
        const user = userMap[order.user];
        return {
          ...order.toObject(),
          user: user,
        };
      });

      let totalAmount = 0;
      combinedOrders.forEach((order) => {
        totalAmount += order.totalPrice;
      });
      // For Admin check orders status we use this query
      // Retrieve placed orders
      const placedOrders = await orderModel
        .find({ orderStatus: "Placed" })
        .populate("user", "name");

      // Retrieve dispatched orders
      const processingOrders = await orderModel
        .find({ orderStatus: "Processing" })
        .populate("user", "name");

      // Retrieve dispatched orders
      const dispatchedOrders = await orderModel
        .find({ orderStatus: "Dispatched" })
        .populate("user", "name");

      // Retrieve delivered orders
      const deliveredOrders = await orderModel
        .find({ orderStatus: "Delivered" })
        .populate("user", "name");
      res.status(200).json({
        success: true,
        total_amount: totalAmount,
        orders: combinedOrders,
        processingorder: processingOrders,
        placedorder: placedOrders,
        dispatchedorder: dispatchedOrders,
        deliveredorder: deliveredOrders,
      });
    } catch (error) {
      next(error);
    }
  };
  // calculate sales

  static calculateSales = async (req,res,next) => {
    try {
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );
      const startOfWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay()
      );
      const endOfWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay() + 7
      );
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
        23,
        59,
        59
      );
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59);

      const sales = await Promise.all([
        orderModel.aggregate([
          {
            $match: {
              createdAt: { $gte: startOfDay, $lt: endOfDay },
            },
          },
          {
            $group: {
              _id: null,
              totalSales: { $sum: "$totalPrice" },
            },
          },
        ]),
        orderModel.aggregate([
          {
            $match: {
              createdAt: { $gte: startOfWeek, $lt: endOfWeek },
            },
          },
          {
            $group: {
              _id: null,
              totalSales: { $sum: "$totalPrice" },
            },
          },
        ]),
        orderModel.aggregate([
          {
            $match: {
              createdAt: { $gte: startOfMonth, $lt: endOfMonth },
            },
          },
          {
            $group: {
              _id: null,
              totalSales: { $sum: "$totalPrice" },
            },
          },
        ]),
        orderModel.aggregate([
          {
            $match: {
              createdAt: { $gte: startOfYear, $lt: endOfYear },
            },
          },
          {
            $group: {
              _id: null,
              totalSales: { $sum: "$totalPrice" },
            },
          },
        ]),
      ]);

      const [todaySales, weeklySales, monthlySales, yearlySales] = sales;

      console.log("Today's Sales:", todaySales);
      // console.log("Today's Saleasass:", sales);
      console.log("Weekly Sales:", weeklySales);
      console.log("Monthly Sales:", monthlySales);
      console.log("Yearly Sales:", yearlySales);
      res
        .status(200)
        .json({
          success: true,
          todaySales,
          weeklySales,
          monthlySales,
          yearlySales,
        });
    } catch (error) {
      console.error(error);
    }
  };
  // update orderstatus
  static updateorderstatus = async (req, res, next) => {
    try {
      const order = await orderModel.findById(req.params.id);
      if (!order) {
        return next(new ErrorHandler("Order not found"), 404);
      }
      if (order.orderStatus == "Delivered") {
        return next(
          new ErrorHandler("You have already deliver this order"),
          400
        );
      }
      // order.orderItem.forEach(async(o)=>{
      //     await orderController.updateStock(o.product,o.quantity)
      // })
      order.orderStatus = req.body.status;
      if (req.body.status == "Delivered") {
        order.deliverAt = Date.now();
      }
      await order.save({ validateBeforeSave: false });
      res.status(200).json({
        success: true,
      });
    } catch (err) {
      console.log(err);
    }
  };
  // static async updateStock(id, quantity) {
  //     const product = await productModel.findById(id);
  //     product.stock -= quantity;
  //     await product.save({ validateBeforeSave: false });
  //   }
  // delete order ---admin
  static deleteorder = async (req, res, next) => {
    try {
      const order = await orderModel.findById(req.params.id);
      if (!order) {
        return next(new ErrorHandler("Order not found with this id"), 404);
      }
      await order.deleteOne();
      res.status(200).json({
        success: true,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

export default orderController;
