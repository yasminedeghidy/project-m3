const nodemailer = require("nodemailer");

async function sendEmail(to, message){
    let transporter = nodemailer.createTransport({
        service:"gmail",
        port: 587,
        secure: false, 
        auth: {
          user:process.env.SENDER, 
          pass:process.env.SENDER_PASSWORD,
        },
      });
      let info = await transporter.sendMail({
        from: `"YASMINE 👻" <${process.env.SENDER}>`, 
        to: to,
        subject: "Confirmation Mail ✔", 
        text: "Hello Confirmation Email?", 
        html:message,
        
       
      });
    
}

module.exports=sendEmail;