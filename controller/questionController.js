const { StatusCodes } = require('http-status-codes');
const dbConnection=require('../db/dbConfig')
const {v4: uuidv4}=require('uuid')

async function askQuestion(req,res) {
    const { title, description } = req.body
    const questionid = uuidv4()
    // user id extracted from middlrware
    const userid=req.user.userid
    console.log(questionid)
    console.log(userid)

    if (!title || !description) {
        return res.status(StatusCodes.BAD_REQUEST).json({msg:"please fill all requirements"})
    }
    try {
        await dbConnection.query(
            "INSERT INTO questions(questionid,userid,title,description) VALUES(?,?,?,?)",
            [questionid, userid, title, description]);
        return res.status(StatusCodes.CREATED).json("success")
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"something want wrong ,try again later"})
    }
}


async function allQuestion(req, res) {
   try {
    const [questions] = await dbConnection.query(`SELECT q.*, u.username 

    FROM questions q 

    INNER JOIN users u ON q.userid = u.userid 

    ORDER BY q.id DESC`)
       if (questions.length==0) {
        return res.status(StatusCodes.BAD_REQUEST).json({msg:"please fill all requirements"})
       }
       return res.json({questions})
   } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"something want wrong ,try again later"})
   }
   
    // res.send(" all question ")

}


async function singleQuestion(req,res) {
    const { questionid } = req.params;
    try {
        const [question] = await dbConnection.query("SELECT * FROM questions WHERE questionid =?",[questionid]);
        if (question.length==0) {
            return res.status(StatusCodes.BAD_REQUEST).json({msg:"please fill all requirements"})
        }
        return res.json({ question })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"something want wrong ,try again later"})
    }
}

module.exports = { askQuestion, allQuestion, singleQuestion };