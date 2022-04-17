const { signUp, verifyAccount, resendEmail, signIn, profileLogin, editProfilePic, editCoverPic, getAllUser, shareProfile, qrLinkDisplayProfile, redisDb } = require("../controller/userController");
const isAuth= require("../../../common/middleware/isAuthorized");
const { signUpValidator } = require("../express_validator/userValidator");
const handleValidation = require("../../../common/middleware/handleValidation");
const { PROFILR_LOGIN, EDIT_PROFILE_PIC, EDIT_PROFILE_COVER, GET_ALL_USER, SHARE_PROFILE } = require("../endPoints");
const upload = require("../../../common/services/uploadFile");

const router=require("express").Router()

router.post('/user/signup',signUpValidator,handleValidation(),signUp)

router.get('/user/confirm/:token', verifyAccount)

router.get('/user/email/re_send/:token', resendEmail)

router.post('/user/login', signUpValidator[1,2],handleValidation(),signIn)

router.get('/user/profile', isAuth(PROFILR_LOGIN),profileLogin)

router.patch('/user/profile/pic', upload.single('img'),isAuth(EDIT_PROFILE_PIC),editProfilePic)

router.patch('/user/profile/cover', upload.array('img',10),isAuth(EDIT_PROFILE_COVER),editCoverPic)

router.get('/admin/allUser', isAuth(GET_ALL_USER),getAllUser)

router.patch('/user/share/profile', isAuth(SHARE_PROFILE),shareProfile)

router.get('/user/:id', qrLinkDisplayProfile)

 router.get("/getRepo/:username",redisDb)

module.exports=router;