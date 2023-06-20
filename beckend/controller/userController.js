import ErrorHandler from "../utils/errorhandler.js"
import userModel from "../model/userModel.js"
import sendtoken from "../utils/jwt.js"
import sendEmail from "../utils/sendmail.js"
import crypto from 'crypto'
import { errormiddle } from "../middleware/error.js"
import cloudinary from 'cloudinary'
class UserController{

    static adminuserregister = async (req, res) => {
        try {
          console.log('ressssssss', req.body);
          const mycloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
          });
          console.log(mycloud);
          const { name, email, password,role } = req.body;
          const user = await userModel.create({
            name,
            email,
            password,
            role,
            avatar: {
              public_id: mycloud.public_id,
              url: mycloud.secure_url,
            },
          });
          sendtoken(user, 201, res);
        } catch (err) {
          console.log('rrrerr', err);
          if (err.errors && err.errors['avatar.url'] && err.errors['avatar.public_id']) {
            // Handle validation errors for avatar.url and avatar.public_id fields
            return res.status(400).json({
              success: false,
              message: 'Avatar URL and public ID are required.',
            });
          }
          res.status(400).json({ success: false, message: `Duplicate ${err.keyValue.email}` });
        }
      };
      
    static userregister = async (req, res) => {
        try {
          console.log('ressssssss', req.body);
          const mycloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
          });
          console.log(mycloud);
          const { name, email, password } = req.body;
          const user = await userModel.create({
            name,
            email,
            password,
            avatar: {
              public_id: mycloud.public_id,
              url: mycloud.secure_url,
            },
          });
          sendtoken(user, 201, res);
        } catch (err) {
          console.log('rrrerr', err);
          if (err.errors && err.errors['avatar.url'] && err.errors['avatar.public_id']) {
            // Handle validation errors for avatar.url and avatar.public_id fields
            return res.status(400).json({
              success: false,
              message: 'Avatar URL and public ID are required.',
            });
          }
          res.status(400).json({ success: false, message: `Duplicate ${err.keyValue.email}` });
        }
      };
      
    static loginuser=async(req,res,next)=>{
   
        const {email,password} = req.body;
        if(!email || !password){
            return next(new ErrorHandler("Please Enter Email & Password",400))
        }
        const user = await userModel.findOne({email}).select("+password");
        if(!user){
            return next(new ErrorHandler("Invalid email or password",401))
        }
        const ispasswordmatched = await user.comparePassword(password);
        if(!ispasswordmatched){
            return next(new ErrorHandler("Invalid email or password",401))
        }
        sendtoken(user,200,res)
    }
    static logout(req, res, next) {
        try {
            res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
            res.status(200).json({ success: true, message: "Logout" });
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
    
    // update User Role -- Admin
static updateUserRole = async (req, res, next) => {
    try{
     
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
  
    await userModel.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
    });
}
catch(error){
    console.log(error)
}
  };
  
    static forgetpassword = async(req,res,next)=>{
        const user = await userModel.findOne({email:req.body.email});
        if(!user){
            return next(new ErrorHandler("User not found",404))
        }
        // Get reset password token
        const resetToken= user.getreset();

        console.log(resetToken) 
        await user.save({validateBeforeSave:false});
        const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
        console.log(resetPasswordUrl)
        const message =`Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested please ignor it `;
        try{
            await sendEmail({
                email:user.email,
                subject:'Ecommerce Password Recovery',
                message,
            })
            res.status(200).json({
                success:true,
                message:`Email send to ${user.email} successfully`
            })
        }
        catch(error){
            user.resetpasswordExpire=undefined,
            user.resetpasswordToken=undefined,
            await user.save({validateBeforeSave:false});            
            return next(new ErrorHandler(error.message, 500))
        }

    }
    static resetpassword=async(req,res,next)=>{
        try{
            console.log('req',req.body)
            const resetpasswordtoken= crypto.createHash("sha256").update(req.params.token).digest("hex");
            const user = await userModel.findOne({resetpasswordtoken,resetpasswordExpire:{$gt : Date.now()}})
            if(!user){
                return next(new ErrorHandler("Invalid Token or has been expired",400))
            }
            if(req.body.password !== req.body.confrimpassword){
                return next(new ErrorHandler("Password does not matched",400))
            }
            user.password = req.body.confrimpassword;
            user.resetpasswordExpire=undefined,
            user.resetpasswordToken=undefined,


            await user.save();
            sendtoken(user,200,res)
        }
        catch(err){
            console.log("hello",err)
        }
    }
    static getuserdetail = async(req,res,next)=>{
        try{
            console.log("id",req.body)
            const user = await userModel.findById(req.user.id);
            res.status(200).json({success:true , user})
        }
        catch(error){
            console.log(error)
        }
    }
    static updatepassword = async(req,res,next)=>{
        try{
            const user = await userModel.findById(req.user.id).select("+password");
            const ispasswordmatched = await user.comparePassword(req.body.oldpassword);
            if(!ispasswordmatched){
                return next(new ErrorHandler("Old password is incorrect",400));
            }
            if(req.body.newpassword !== req.body.confirmpassword)
            {
                return next(new ErrorHandler("Password does not matched",400));
            }
            user.password = req.body.newpassword;
            await user.save();
            sendtoken(user , 200 , res)
        }
        catch(error){
            console.log(error)
        }
    }
    static updateprofile = async(req,res,next)=>{
        try{
            const newUserData={
                name:req.body.name,
                email:req.body.email,
            };
            if(req.body.avatar!==''){
                const user = await userModel.findById(req.user.id);
                const image_id = user.avatar.public_id;
                await cloudinary.v2.uploader.destroy(image_id);
                const mycloud= await cloudinary.v2.uploader.upload(req.body.avatar,{
                    folder:"avatars",
                    width:150,
                    crop:"scale",
                })
                newUserData.avatar = {
                    public_id:mycloud.public_id,
                    url:mycloud.secure_url
                }
            }
            const user =await userModel.findByIdAndUpdate(req.user.id,newUserData,{
                new:true,
                runValidators: true,
            });
            res.status(200).json({
                success:true,
                message:"Update successfully",
                user
            })
        }
        catch(error){
            console.log(error)
        }
    }
    // Get all user ----(ADMIN)
    static getalluser = async(req,res,next)=>{
        const users=await userModel.find();
        res.status(200).json({
            success:true,
            users,
        })
    }
    // Get single user detail ---(admin)
    static getsingleuser = async(req,res,next)=>{
        const user = await userModel.findById(req.params.id);
        if (!user){
           return next(new ErrorHandler(`User doen not exist:${req.params.id}`,400))
        } 
        res.status(200).json({
            success:true,
            user
        })
    }
    // Update user role
    static updateuserole = async(req,res,next)=>{
        try{
            const newUserData={
                name:req.body.name,
                email:req.body.email,
                role:req.body.role
            };
            const user = await userModel.findByIdAndUpdate(req.params.id, newUserData, {
                new: true,
                runValidators: true,
                useFindAndModify: false,
              });
            res.status(200).json({
                success:true,
                message:"Update role successfully",
                user
            })
        }
        catch(error){
            console.log(error)
        }
    }

// Delete user
 // Update user role
 static deleteuser = async(req,res,next)=>{
    try{
        const user = await userModel.findById(req.params.id);
        if (!user){
           return next(new ErrorHandler(`User does not exist:${req.params.id}`,400))
        } 
        await user.deleteOne();
        res.status(200).json({
            success:true,
            message:"delete user successfully",
            user
        })
    }
    catch(error){
        console.log(error)
    }
}

}

export default UserController