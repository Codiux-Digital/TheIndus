import productModel from "../model/productsModel.js"
import ErrorHandler from "../utils/errorhandler.js"
import ApiFeacture from "../utils/apifeacture.js"
import cloudinary from 'cloudinary'
import categoryModel from "../model/categoryModel.js"
class productController{
    // create product Admin
      static createproduct=async(req,res,next)=>{
        try{
          console.log('category',req.body.category)
          const mycloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
          });
          console.log(mycloud);
            const{name,description,price,active,createdAt,discount_price}=req.body
            const existingCategory = await categoryModel.findOne({ 
              Category_name: req.body.category });
              console.log('existing',existingCategory)
            const doc=new productModel({
                name:name,
                description:description,
                price:price,
                images:{
                  public_id: mycloud.public_id,
                  url: mycloud.secure_url,
                },
                active:active,
                user:req.user._id,
                discount_price:discount_price,
                createdAt:createdAt,
                category:existingCategory
            })
            const result= await doc.save()
            // console.log(result)
            res.status(201).json({success:true,message:"Product successfully save in dataBase",result})
        }
        catch (err) {
          console.log('rrrerr', err);
          if (err.errors && err.errors['avatar.url'] && err.errors['avatar.public_id']) {
            // Handle validation errors for avatar.url and avatar.public_id fields
            return res.status(400).json({
              success: false,
              message: 'Avatar URL and public ID are required.',
            });
          }
          res.status(400).json({ success: false, message: `Duplicate`});
        }
      }  
  // Update product
static updateproduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, createdAt, discount_price, category } = req.body;

    const existingCategory = await categoryModel.findOne({ name: category });

    if (!existingCategory) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    let product = await productModel.findById(id);

    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }

    product.name = name;
    product.description = description;
    product.price = price;
    product.stock = stock;
    product.createdAt = createdAt;
    product.discount_price = discount_price;
    product.category = existingCategory;
    product.user = req.user._id,
    product = await product.save();

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

      // Get All Product
    static getallproduct=async(req,res,next)=>{
        try{
            // console.log('ddd',req.query)
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');           
            const resultperpage = 6;
            const productCount = await productModel.countDocuments()
            const apifeacture = new ApiFeacture(productModel.find(),req.query).search().filter(); 
            let data = await apifeacture.query
            let filteredproductcount = data.length
           apifeacture.pagination(resultperpage)
            console.log('dataaa',data)
            res.status(200).json({message:"Route is working",data,productCount,resultperpage,filteredproductcount})
        }catch(error){
            // console.log(error)
        }
    }

    // get all products categories wise
    // static getProductsByCategory = async (req, res, next) => {
    //   try {
    //     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    
    //     // Retrieve all products
    //     const products = await productModel.find();
    //     const resultperpage = 6;
    //     const productCount = await productModel.countDocuments()
    //     // Group products by category
    //     const groupedProducts = products.reduce((acc, product) => {
    //       const { category } = product;
    //       if (!acc[category]) {
    //         acc[category] = [];
    //       }
    //       acc[category].push(product);
    //       return acc;
    //     }, {});
        
    //     res.status(200).json({
    //       message: 'Route is working',
    //       data: groupedProducts,productCount,resultperpage
    //     });
    //   } catch (error) {
    //     console.log(error);
    //     res.status(500).json({ message: 'Internal server error' });
    //   }
    // };
    static getProductsByCategory = async (req, res, next) => {
      try {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    
        // Retrieve all products and populate the "category" field with the name
        const products = await productModel.find().populate('category', 'Category_name');
        const resultperpage = 6;
        const productCount = await productModel.countDocuments();
    
        // Group products by category with category name included
        const groupedProducts = products.reduce((acc, product) => {
          const { category } = product;
          const categoryName = category?.Category_name; // Use optional chaining (?.) to access the property safely
          if (categoryName) {
            if (!acc[categoryName]) {
              acc[categoryName] = [];
            }
            acc[categoryName].push(product);
          }
          return acc;
        }, {});
    
        // Convert groupedProducts object to an array
        const categories = Object.entries(groupedProducts).map(([categoryName, products]) => ({
          categoryName,
          products,
        }));
    
        res.status(200).json({
          message: 'Route is working',
          data: categories,
          productCount,
          resultperpage
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };
    
    
    
    
      

    static getsingleproduct=async(req,res,next)=>{
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');  
        console.log(req)  
        let product= await productModel.findById(req.params.id);            
        try{
            if(!product)
           {
            return next(new ErrorHandler("product not found",404));
           }
            res.status(200).json({
                success:true,
                product
            })
        }catch(error){
            console.log(error)
            res.status(500).json({success:false,message:Error.errors.name.message})
        }
    }
   
    static deleteproduct = async(req,res,next)=>{
        try{
            let product= await productModel.findById(req.params.id);       
            if(!product)
           {
            return next(new ErrorHandler("product not found",404));
           }
           for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
          }
        
          await product.deleteOne();
            res.status(200).json({
                success:true,
                message:"Delete successfully"
            })
        }
        catch(error){
            console.log(error)
        }
    }
   static getAdminProducts = async (req, res, next) => {
        const products = await productModel.find();
      
        res.status(200).json({
          success: true,
          products,
        });
      };
   

}

export default productController