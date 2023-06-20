// Creating token and send to cookie

const sendtoken = (user,statusCode,res)=>{
    const token = user.getJWTtoken();
    // option cookie
    const options={
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE *24*60*60*1000
        ),
        HttpOnly:true
    };
    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        user,token
    })
}
export default sendtoken