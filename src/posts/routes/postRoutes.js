
const isAuth= require("../../../common/middleware/isAuthorized")
const { CREATE_POST, LIKE_POST, CREATE_COMMENT } = require("../endPointsPost")
const upload = require("../../../common/services/uploadFile");
const { createPost, getPost, likePost, createComment } = require("../controller/postController");

const router=require("express").Router()

router.post('/post',isAuth(CREATE_POST) ,upload.array("img", 12),createPost)

router.get('/post/:id', getPost)

router.patch('/post/like/:id', isAuth(LIKE_POST),likePost)

router.post('/post/comment/:id',isAuth(CREATE_COMMENT) ,upload.array("img", 12),createComment)




module.exports=router