
const { StatusCodes } = require("http-status-codes")
const jwt = require("jsonwebtoken")
async function middleWare(req,res,next) {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith("Bearer") ) {
      return res.status(StatusCodes.UNAUTHORIZED).json({msg:'authorization invalid'})
    }
    const token=authHeader.split(' ')[1]
    console.log(authHeader)
    console.log(token)
    try {
        const { username, userid,firstname } = jwt.verify(token,  process.env.JWT_SECRET)
      req.user = { username, userid, firstname, };
      next();

    } catch (error) {
      console.log(error.message)
        return res.status(StatusCodes.UNAUTHORIZED).json({msg:'authorization invalid'}) 
    }
}
module.exports=middleWare