import categoryModel from '../model/categoryModel.js';
import orderModel from "../model/orderModel.js"

class categoryController{
    static createCategory = async(req,res,next)=>{
            try{
                console.log(req.body)
            const{category , sorting , active} = req.body
            const doc = new categoryModel({
                Category_name:category,
                sorting:sorting,
                active:active
            })
            const result =await doc.save()
            res.status(200).json({success:true, message:"Category Add",result})
            }
            catch(Error){
                console.log(Error)
                res.status(500).json({success:false,message:Error.message})
            }
    }

    static allCategories = async(req,res,next)=>{
        try{
            const category = await categoryModel.find()
            console.log(category)
            res.status(200).json({success:true,category})
        }
        catch(Error){
            res.status(500).json({success:false,message:Error.message})
        }
    }
    static updateCategories = async(req,res,next)=>{
        try{
            const { id } = req.params;
            const newUserData={
                Category_name:req.body.category,
                sorting:req.body.sorting,
                active:req.body.active
            };
            const category =await categoryModel.findByIdAndUpdate(id,newUserData,{
                new:true,
                runValidators: true,
            });
            res.status(200).json({
                success:true,
                message:"Update successfully",
                category
            })
        }
        catch(error){
            console.log(error)
        }
    }
    static deleteCategories = async(req,res,next)=>{
            
            try{
                const { id } = req.params;
                const user = await categoryModel.findById(id);
                if (!user){
                   return next(new ErrorHandler(`Category does not exist:${req.params}`,400))
                } 
                await user.deleteOne();
                res.status(200).json({
                    success:true,
                    message:"delete category successfully",
                    user
                })
            }
            catch(error){
                console.log(error)
            }    

        }
      
}

      

export default categoryController
