const multer  = require('multer')
const { nanoid } = require('nanoid')
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
     
      cb(null, nanoid()+ '-'+  file.originalname)
    }
  })
  function fileFilter (req, file, cb) {
      if(!file.mimetype==="image/png"  && file.mimetype==="image/jpeg" && file.mimetype==="image/jpg"){

        cb("in-valid file type ", false)
      }
      else{
        cb(null, true)
       

      }
  }

  const upload = multer({dest:'uploads/',fileFilter ,storage })
  module.exports=upload