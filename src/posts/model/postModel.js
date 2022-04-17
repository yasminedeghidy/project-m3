const mongoose=require("mongoose");
 const postSchema=require("../schema/postSchema")

const postModel=mongoose.model('post', postSchema)

module.exports=
    postModel;