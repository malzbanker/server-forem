const express = require('express');
const router = express.Router()
const middleWare = require('../middleWare/middleWare')

const {addAnswer,getAnswer}=require('../controller/answerController')

router.post("/addanswer/:id",middleWare, addAnswer);
router.get("/getanswer/:questionid", middleWare,getAnswer);

module.exports=router