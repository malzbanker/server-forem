const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbConfig");

async function addAnswer(req, res) {
  const { questionid,answer } = req.body;
  const { userid } = req.user;
 
  if (!answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please fill all requirements" });
  }
  try {
    // uniqueid = await dbConnection.query(`SELECT* FROM questions WHERE questionid=?`, [questionid])
    await dbConnection.query(
      `INSERT INTO answers(userid,questionid,answer) VALUES(?,?,?)`,
      [userid, questionid, answer]
    );
    return res.json("answer added success");
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something want wrong ,try again later" });
  }
}

// async function getAnswer(req, res) {
//     // const {questionid}=req.params
//     try {
//         const {questionid}=req.params
//         const [answer] = await dbConnection.query(`SELECT * from answers WHERE questionid=?
//     `,[questionid])
//            return res.json({answer})
//        } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"something want wrong ,try again later"})
//        }

// }

async function getAnswer(req, res) {
  try {
    const { questionid } = req.params;
    console.log(questionid);

    const [answers] = await dbConnection.query(
      `SELECT answers.answer, users.username FROM answers INNER JOIN users ON answers.userid = users.userid
              WHERE answers.questionid = ?`,
      [questionid]
    );
    if (answers.length > 0) {
      return res.status(StatusCodes.OK).json({ answers });
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "no answers found" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong while fetching answers" });
  }
}

module.exports = { addAnswer, getAnswer };
