import mongoose from 'mongoose'

const connectDb = async(DATABASE_URL)=>{
    try{
        const DB_OPTION={
            dbName:'TheIndus'
        }
        mongoose.set('strictQuery',true);
        await mongoose.connect(DATABASE_URL,DB_OPTION);
        console.log("Connected")
    }
    catch(err){
            console.log(err)
    }
}


export default connectDb