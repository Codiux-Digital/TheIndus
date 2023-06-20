import mongose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
const userSchema = new mongose.Schema({
    name:{
        type:String,
        required:[true,"Please enter Name"],
        maxLength:[30,"Name digits not excced 30"],
        minLength:[4,"Name digits should have 4 "]
    },
    email:{
        type:String,
        required:[true,"Please enter Email"],
        unique:true,
        validator:[validator.isEmail,"Please enter valide email"]
    },
    password:{
        type:String,
        required:[true ,"Please enter passeord"],
        minLength:[8,"Password must be greater than 8 digits"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            // required:true
        },
        url:{
            type:String,
            // required:true
        }
    },
    role:{
        type:String,
        default:"user",
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    resetpasswordToken:String,
    resetpasswordExpire:Date,
})

// For password Modified
userSchema.pre("save", async function(next){

    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10)
});

// JWT token
userSchema.methods.getJWTtoken = function(){
    return jwt.sign({id:this._id} , process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    });
};

// Compared password
userSchema.methods.comparePassword = async function(enterpassword){
        return bcrypt.compare(enterpassword,this.password)
}

// Generating password reset token
userSchema.methods.getreset =  function(){
    const resetToken = crypto.randomBytes(20).toString("hex");
    // hashing and adding resetpasswordtoken schema
    this.resetpasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetpasswordExpire= Date.now() + 15*60*1000 ;
    return resetToken;
}








const userModel = mongose.model("user",userSchema);

export default userModel