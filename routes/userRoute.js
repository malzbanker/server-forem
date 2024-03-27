const express = require('express');
const router = express.Router()

// authorization middleware
const middleWare=require('../middleWare/middleWare')

// user controller
const {register,login,checkUser}=require('../controller/userController')


// register route
router.post("/register",register)

// login
router.post("/login", login)


// check user

router.get("/check",middleWare, checkUser)

module.exports=router