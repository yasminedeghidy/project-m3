const mongoose=require("mongoose");
const bcrypt = require('bcrypt');
const userSchema=new mongoose.Schema({

    userName:{type:String,required:true},
    firstName:String,
    lastName:String,
    email:{type:String,required:true},
    password:{type:String,required:true},
    phone:String,
    gender:{type:String,default:"Male"},
    confirmed:{type:Boolean,default:false},
    role:{type:String,default:"user"},
    shareProfileLink:String,
    profilePic:String,
    coverPic:Array,
    socialLink:Array,
    gallary:Array,
    follower:Array,
    accountStatus:{type:String,default:"offline"},
    pdfLink:String,
    story:Array
},{
    timestamps:true
})

userSchema.pre('save', async function(next){
    this.password=await bcrypt.hash(this.password,parseInt(process.env.SALT_ROUNDS))
    next();
})



module.exports=userSchema;