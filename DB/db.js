const mongoose=require("mongoose");

const dbConnection= async()=>{

    return await mongoose.connect(process.env.CONNECTION_STRING).then((result)=>{
       console.log("Connected!");
    }).catch((err)=>{
        console.log("Error!" , err)
    })
}

module.exports=dbConnection