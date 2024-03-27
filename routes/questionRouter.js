const express = require('express');
const router = express.Router()
const middleWare=require('../middleWare/middleWare')
const {askQuestion,allQuestion,singleQuestion}=require("../controller/questionController")

router.post("/askquestion", middleWare,askQuestion)
router.get("/allquestion",middleWare, allQuestion)
router.get("/singlequestion/:questionid",middleWare,singleQuestion)

module.exports=router