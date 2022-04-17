const userModel = require("../model/userModel");
const jwt = require('jsonwebtoken');
const sendEmail = require("../../../common/services/sendEmail");
const bcrypt = require('bcrypt');
const paginationService = require("../../../common/services/paginationService");
const search = require("../../../common/services/findServices");
var QRCode = require('qrcode')
const Redis = require("ioredis");
const axios = require('axios');
exports.signUp=async(req,res)=>{
    const{userName, email, password}=req.body;
    try {
        const user=await userModel.findOne({email});
        if(user){
            res.status(400).json({message:"E-mail already exist"})
        }else{
            const newUser=new userModel({userName, email, password})
            const savedUser=await newUser.save();
            const token=jwt.sign({_id:savedUser._id}, process.env.SECRET_KEY,{expiresIn:'1y'})
            const refreshToken=jwt.sign({_id:savedUser._id}, process.env.SECRET_KEY);

            const message=`<a href="${req.protocol}://${req.headers.host}/user/confirm/${token}">Click here to Confirm</a><br><a href="${req.protocol}://${req.headers.host}/user/email/re_send/${refreshToken}">re-send activation  link</a>`
             await sendEmail(email,message)
             res.status(200).json({message:"Done",data:savedUser});
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Error", error})
        
    }
}

exports.verifyAccount=async(req,res)=>{
    const{token}=req.params;
    try {
        if(!token || token==undefined || token==null){
            res.status(400).json({message:"error Token"})
        }
        else{
            const decoded=jwt.verify(token,process.env.SECRET_KEY)
            const user=await userModel.findOneAndUpdate({_id:decoded._id},{confirmed:true}, {new:true})
            if(user)
            {
            res.status(200).json({message:"Success Confirmed"})
            }else
            {
                res.status(400).json({message:"invalid user"})
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Error", error})
    }
}

exports.resendEmail=async(req,res)=>{
    const{token}=req.params;
    try {
        if(!token || token==undefined || token==null){
            res.status(400).json({message:"error Token"})
        }
        else{
            const decoded=jwt.verify(token,process.env.SECRET_KEY)
            const user=await userModel.findOne({_id:decoded._id},{confirmed:false})
            if(user)
            {

                const token=jwt.sign({_id:user._id}, process.env.SECRET_KEY,{expiresIn:'1y'})
            const refreshToken=jwt.sign({_id:user._id}, process.env.SECRET_KEY);
       
            const message=`<a href="${req.protocol}://${req.headers.host}/user/confirm/${token}">Click here to Confirm</a><br><a href="${req.protocol}://${req.headers.host}/user/email/re_send/${refreshToken}">re-send activation  link</a>`
             await sendEmail(user.email,message)
             res.status(200).json({message:"Done ,check your email"});


        
            }else
            {
                res.status(400).json({message:"invalid user"})
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Error", error})
    }
}
exports.signIn=async(req,res)=>{
    const{email, password}=req.body;
    try {
        const user=await userModel.findOne({email});
        if(!user){
            res.status(400).json({message:"invalid email"})
        }else{
            if(!user.confirmed){
                res.status(400).json({message:"please confirm your email first"})

            }else{
                const match=await bcrypt.compare(password,user.password)
                if(!match){
                    res.status(400).json({message:"error password"})

                }else{
                    const token=jwt.sign({_id:user._id,isLoggedIn:true},process.env.SECRET_KEY, {expiresIn:'1y'})
                    await userModel.findOneAndUpdate({email}, {accountStatus:"online"})
                    res.status(200).json({message:"Success Login!",token})
                }
            }
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"error", error})
    }
}

exports.profileLogin=async(req,res)=>{
    try {
        const user= await userModel.findOne({_id:req.user._id}).select('-password')
        if(!user){res.status(400).json({message:"invalid-user"})}
        else{
            res.status(200).json({message:"Success", data:user})

        }
        
    } catch (error) {
        console.log(error)
        res.json({message:"error", error})
        
    }
}

exports.editProfilePic=async(req,res)=>{
    console.log(req.file)
    try {
        if(!req.file){
            res.status(400).json({message:"you don't upload the image!"})
        }
        else{
            const imageURL=`${req.protocol}://${req.headers.host}/${req.file.destination}/${req.file.filename}`
            const user=await userModel.findOneAndUpdate({_id:req.user._id}, {profilePic:imageURL})
            if(user)
            {
                res.status(200).json({message:"Done Upload image", imageURL})
            }else{
                res.status(400).json({message:"in-valid user"})
            }
        }

        
    } catch (error) {
        console.log(error)
        res.json({message:"error", error})
        
    }
}

exports.editCoverPic=async(req,res)=>{
    console.log(req.files)
    try {
        if(!req.files){
            return res.status(400).json({message:"you don't upload the image!"})
        }
        else{
            let imageURL=[]
            for(let i =0;i<req.files.length;i++){

                let imagesURL=`${req.protocol}://${req.headers.host}/${req.files[i].destination}/${req.files[i].filename}`
                imageURL.push(imagesURL)
            }
                const user=await userModel.findByIdAndUpdate({_id:req.user._id},{coverPic:imageURL},{new:true})
                if(user)
                {
                    // console.log(user.coverPic[2])
                    return res.status(200).json({message:"Done Upload image", imageURL})
                 
                }else{
                    return res.status(400).json({message:"in-valid user"})
                }

            
           
        }

        
    } catch (error) {
        console.log(error)
        return res.json({message:"error", error})
        
    }
}



exports.getAllUser=async(req,res)=>{
    const{searchKey}=req.query;
 
    let{page,size}=req.query;

    let{limit, skip}=paginationService(page,size)
    try {
       const data=await  search(userModel,skip,limit, searchKey,[
             "userName", 
             "email"
            ])

       
        res.status(200).json({message:"Done",data})


        
    } catch (error) {
        console.log(error)
        return res.json({message:"error", error})
        
    }
}
exports.shareProfile=async(req,res)=>{
   try{
       QRCode.toDataURL(`${req.protocol}://${req.headers.host}/user/${req.user._id}`,async function(err,url){
           if(err)
           {
               res.status(400).json({message:"QR Error", err})
           }
           else{
               const updateUser=await userModel.findByIdAndUpdate(req.user._id,{shareProfileLink:url},{new:true})
               res.status(200).json({message:"QR DONE", updateUser, url})
           }
       })
    } catch (error) {
        console.log(error)
        return res.json({message:"error", error})  
    }
}
exports.qrLinkDisplayProfile=async(req,res)=>{
    const{id}=req.params;
    const user=await userModel.findById(id).select('-password');
    res.status(200).json({message:"Success", user})

}

exports.redisDb=async(req,res)=>{
    const clientRedis = new Redis(
  {
    port: 6379,
    host: "localhost",
  },

);

        const{username}=req.params;
        try {
    
            const cashe=await clientRedis.get("test");
            if(cashe){
                res.status(200).json({message:"Success From cashe", public_repos:cashe})
            }else{
                const { data }=await axios.get(`https://api.github.com/users/${username}
                `)
                await clientRedis.setex("test", 15, data.public_repos) 
               res.status(200).json({message:"Success get data from database", public_repos:data.public_repos})
              
            } 
        } catch (error) {
            console.log(error)
            res.status(500).json({message:"errro", error})
            
        }
    }
      
    























