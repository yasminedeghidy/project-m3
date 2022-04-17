const sendEmail = require("../../../common/services/sendEmail");
const userModel = require("../../users/model/userModel");
const postModel = require("../model/postModel");
const { commentSchema } = require("../schema/postSchema");

const populateList=[{
    path:"userID",
    select:"userName email"
},
{
    path:"tags",
    select:"userName email"
},{
    path:"likes",
    select:"userName email"
},{
    path:"comment.userID",
    select:"userName email"
},{
    path:"comment.tags",
    select:"userName email"
}
]



exports.createPost=async(req,res)=>{
    try {

        let imagesURL=[];
        if(req.files){
           
            for(let i =0;i<req.files.length;i++){
                let imageURL=`${req.protocol}://${req.headers.host}/${req.files[i].destination}/${req.files[i].filename}`
                imagesURL.push(imageURL)
            }
        }

        const {desc,tagsList}=req.body;
        console.log(tagsList)
        let tagsEmail='';
        let validTagsIDS=[];
        for(let i =0;i<tagsList.length;i++){
            const findUser=await userModel.findOne({_id:tagsList[i]}).select('email')
            if(findUser){
                validTagsIDS.push(findUser._id)
                if(tagsEmail.length>0){
                    tagsEmail=tagsEmail + " , " + findUser.email
                }else{
                    tagsEmail=findUser.email
                }
            }
        }
        const newPost=new postModel({desc,userID:req.user._id,images:imagesURL,tags:validTagsIDS})
        const savedPost=await newPost.save();

        if (tagsEmail.length > 0) {
            await sendEmail(tagsEmail,
                `<p>hi you have been mentioned in ${req.user.userName}
                  </p>  <br> 
                  <a href='${req.protocol}://${req.headers.host}/post/${savedPost._id}'> please follow me to see the mention </a>`)
        }

        res.json({message:"Success Create Post", data:savedPost})  

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Error", error})
        
        
    }
}

exports.getPost=async(req,res)=>{
    const{id}=req.params;
    try {
        const post=await postModel.findOne({_id:id}).populate("userID", "userName email")
        if(post){
            res.status(200).json({ message: "Done", post})

        }
        else{
            res.status(400).json({ message: "in-valid Post" })

        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error", error})  
    }
}
exports.likePost=async(req,res)=>{
    const{id}=req.params;
    try {
        const post=await postModel.findOne({_id:id})
        if(post){
            if(post.likes.includes(req.user._id)){
                res.status(400).json({message:" sorry you already liked this post before"})
            }
            else{
            post.likes.push(req.user._id)
            const updatePost=await postModel.updateOne({_id:id}, {likes:post.likes}, {new:true})
            res.status(200).json({message:"Success like the post", data:updatePost})
            }
        }else{
            res.status(400).json({message:"in-valid post"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error", error})
    }
}
exports.createComment=async(req,res)=>{
    const{id}=req.params;
    try {

        let imagesURL=[];
        if(req.files){
           
            for(let i =0;i<req.files.length;i++){
                let imageURL=`${req.protocol}://${req.headers.host}/${req.files[i].destination}/${req.files[i].filename}`
                imagesURL.push(imageURL)
            }
        }

        const {desc,tagsList}=req.body;
        console.log(tagsList)
        let tagsEmail='';
        let validTagsIDS=[];

        for(let i =0;i<tagsList.length;i++){

            const findUser=await userModel.findOne({_id:tagsList[i]}).select('email')
            if(findUser){
                validTagsIDS.push(findUser._id)
                if(tagsEmail.length>0){
                    tagsEmail=tagsEmail + " , " + findUser.email
                }else{
                    tagsEmail=findUser.email
                }
            }
        }
        if(!desc){
            desc=""
        }
        const post=await postModel.findOne({_id:id})
        if(post){
            post.comment.push({userID:req.user._id,desc,tags:validTagsIDS})
                const updatePost=await postModel.findOneAndUpdate({_id:post._id}, {comment:post.comment},{new:true}).populate(populateList)
                res.status(200).json({message:"Success make Comment",data:updatePost})

        }
        else{
            res.status(400).json({message:"in-valid post"})
        }


  

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Error", error})
        
        
    }
}

