import Errorhandler from '../utils/errorhandler.js'
import jwt from 'jsonwebtoken'
import userModel from '../model/userModel.js'

const isauthenticated = async(req,res,next)=>{
    try{
        console.log('rrra',req.rawHeaders[13])
        const token = req.rawHeaders[13];
        // console.log('tok',token)
        if(!token){
            return next(new Errorhandler("please login to access this resourcce",401))
        }
        const codedecode = jwt.verify(token,process.env.JWT_SECRET);
        console.log('codee',codedecode)
        req.user = await userModel.findById(codedecode.id);
       req.userModel = await userModel.findById(codedecode.id);
       next()
    }
    catch(err){
        console.log(err)
    }
}
const ISauthenticated = async(req,res,next)=>{
    try{
        console.log('rrrb',req.rawHeaders[15])
        const token = req.rawHeaders[19].split('=')[1]
        // console.log('tok',token)
        if(!token){
            return next(new Errorhandler("please lllogin to access this resource",401))
        }
        const codedecode = jwt.verify(token,process.env.JWT_SECRET);
        
        req.user = await userModel.findById(codedecode.id);
       req.userModel = await userModel.findById(codedecode.id);
       next()
    }
    catch(err){
        console.log(err)
    }
}
const ISAUthenticated = async(req,res,next)=>{
    try{
        console.log('rrrc',req.rawHeaders[15])
        const token = req.rawHeaders[15]
        // console.log('tok',token)
        if(!token){
            return next(new Errorhandler("please lllogin to access this resource",401))
        }
        const codedecode = jwt.verify(token,process.env.JWT_SECRET);
        
        req.user = await userModel.findById(codedecode.id);
       req.userModel = await userModel.findById(codedecode.id);
       next()
    }
    catch(err){
        console.log(err)
    }
}
const Isauthenticated = async(req,res,next)=>{
    try{
        console.log('rrrd',req)
        const token = req.body.headers.Authorization;
        // console.log('tok',token)
        if(!token){
            return next(new Errorhandler("please login to access this resource",401))
        }
        const codedecode = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await userModel.findById(codedecode.id);
        req.userModel = await userModel.findById(codedecode.id);
       next()
    }
    catch(err){
        console.log(err)
    }
}
const ISAuthenticated = async(req,res,next)=>{
    try{
        console.log('rrre',req.rawHeaders[15])
        const token = req.rawHeaders[15].split('=')[1];
        // console.log('tok',token)
        if(!token){
            return next(new Errorhandler("please login to access this resource",401))
        }
        const codedecode = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await userModel.findById(codedecode.id);
        req.userModel = await userModel.findById(codedecode.id);
       next()
    }
    catch(err){
        console.log(err)
    }
}
const authorizrRoles = (...roles)=>{
    try{
    return(req,res,next)=>{
        console.log(req.userModel.role)
        if(!roles.includes(req.userModel.role)){
          return next(new Errorhandler(`Role ${req.userModel.role} is not allowed to access this role`,403))
        }
        next();
    }}
    catch(err){
        console.log(err)
    }
}
const x=10;
export { isauthenticated, ISAUthenticated,authorizrRoles,Isauthenticated,ISauthenticated ,ISAuthenticated,x}