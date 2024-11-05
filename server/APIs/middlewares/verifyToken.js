const jwt=require("jsonwebtoken")



const verifyToken=(request,response,next)=>{
    // token verification logic
    // get bearer token from headers of req
    let bearerToken=request.headers.authorization;
    // if bearer token is not exsited,unauthorized req
   if(bearerToken===undefined){
    response.send({message:"unauthorized"})
   }
    // if bearer token is existed, get token
    else{
        const token=bearerToken.split(" ")[1]
       // verify token using secret key
       try{
        jwt.verify(token,"abcdef");
        next();
       }
       catch(err){
        console.log(err);
       }
       

    }
// MONGO_USERNAME=admin
// MONGO_PASSWORD=admin

// MONGO_CLUSTER=cluster0.kdptbbe.mongodb.net
// MY_EMAIL=yunoastha3@gmail.com
// MY_PASSWORD=pxhcostmjjmzmkwv

    // if token is valid,allow to access protect route
    // else,ask to login again

}
module.exports=verifyToken;
