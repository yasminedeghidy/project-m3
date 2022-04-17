const jwt = require('jsonwebtoken');
const userModel = require('../../src/users/model/userModel');
const rbac = require('../rbac/rbac');

const isAuth=(endPoint)=>{
    return async(req,res,next)=>{
        try {
            const headerToken=req.headers['authorization']
        if(!headerToken || headerToken==null || headerToken==undefined || !headerToken.startsWith=='Bearer'){
            res.status(400).json({message:"In-valid Token"})
          }
          else{
              const token=headerToken.split(" ")[1];
              const decoded= jwt.verify(token,process.env.SECRET_KEY)
              const user=await userModel.findOne({_id:decoded._id}).select('-password')
              if(user)
              {
                  req.user=user;
                  const isAllowed=await rbac.can(user.role,endPoint)
                  if(isAllowed)
                  {
                      next()
                  }else{
                    res.status(401).json({message:"UNAUTHORIZED"})

                  }
              }
              else{
                res.status(401).json({message:"UNAUTHORIZED__"})

            }
            

          }
            
        } catch (error) {
            console.log(error)
            res.status(500).json({message:"Error", error})
            
        }
        

}
}
module.exports=isAuth