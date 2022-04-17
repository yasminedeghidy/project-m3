const mongoose=require("mongoose");



const replySchema=new mongoose.Schema({
    userID:{  type:mongoose.Schema.Types.ObjectId, ref:'user'},
    desc:String,
    likes:[{ type:mongoose.Schema.Types.ObjectId, ref:'user' }],
    tags:[{  type:mongoose.Schema.Types.ObjectId, ref:'user'  }],
   
    images:Array,
   

},{
    timestamps:true
})

const commentSchema=new mongoose.Schema({
    userID:{  type:mongoose.Schema.Types.ObjectId, ref:'user'},
    desc:String,
    likes:[{ type:mongoose.Schema.Types.ObjectId, ref:'user' }],
    tags:[{  type:mongoose.Schema.Types.ObjectId, ref:'user'  }],
    images:Array,
    isDeleted:{type:Boolean, default:false},
    deletedBy:{ type:mongoose.Schema.Types.ObjectId, ref:'user' },
    deletedAt:String,
    reply:[replySchema],

},{
    timestamps:true
})




    const postSchema=new mongoose.Schema({    
    userID:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
    desc:String,
    images:Array,
    tags:[{  type:mongoose.Schema.Types.ObjectId, ref:'user'  }],
    likes:[{ type:mongoose.Schema.Types.ObjectId, ref:'user' }],
    comment:[commentSchema],
    isBlocked:{type:Boolean, default:false}




},{
    timestamps:true
})





module.exports=postSchema;