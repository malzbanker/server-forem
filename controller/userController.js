// dbconnection
const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// async function register(req, res) {
//     const { username, firstname, lastname, email, password } = req.body;
//     if (!username || !firstname || !lastname || !email || !password) {
//         return res.status(StatusCodes.BAD_REQUEST).json({msg:"please provide all info"})
//     }
//     try {
//     const [user]=await dbConnection.query("select username,userid from users where username= ? or email= ?",[username,email])
//     if (user.length>0) {
//         return res.status(StatusCodes.BAD_REQUEST).json({msg:"user already registered"})
//         }
//         if (password.length<=8) {
//             return res.status(StatusCodes.BAD_REQUEST).json({msg:"password must be eight character"})
//         }

//         // bcrypt the password
//          const salt=await bcrypt.genSalt(10)
//         const hashedPassword=await bcrypt.hash(password,salt)

// await dbConnection.query("INSERT INTO users (username,firstname,lastname,email,password) values(?,?,?,?,?)",[username,firstname,lastname,email,hashedPassword])
// return res.status(StatusCodes.CREATED).json({msg:"user created"})
// } catch (error) {
//     console.log(error.message)
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:'something want wrong ,try again later'})
//     }

// }

// async function login(req, res) {
//     const { email, password } = req.body;
//     if ( !email || !password) {
//         return res.status(StatusCodes.BAD_REQUEST).json({msg:"please provide all info"})
//     }

//     try {
//         const [user] = await dbConnection.query("select username,userid,password from users where email= ? ", [email])
//         if (user.length == 0) {
//             return res.status(StatusCodes.BAD_REQUEST).json({ msg: "invalid credential" });
//         }
//         // compare pasword
//         const ismuch = await bcrypt.compare(password, user[0].password);
//         if (!ismuch) {
//             return res.status(StatusCodes.BAD_REQUEST).json({ msg: "invalid credential" });
//         }

//         const username = user[0].username
//         const userid = user[0].userid;
//         const token = jwt.sign({username, userid}, process.env.JWT_SECRET, { expiresIn: "1d" })

//         return res.status(StatusCodes.OK).json({user:"user login successful",token})
//     } catch (error) {
//         console.log(error.message)
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:'something want wrong ,try again later'})
//     }
// }

// async function checkUser(req, res) {
//     const username = req.user.username
//     const userid = req.user.userid
//     res.status(StatusCodes.OK).json({msg:"valid user",username,userid})

// }

// register function

async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;

  if (!username || !firstname || !lastname || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter values for all fields." });
  }
  if (password.length < 8) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Password should be at least 8 characters long." });
  }

  try {
    const [existingUser] = await dbConnection.query(
      "SELECT username, userid FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUser.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    await dbConnection.query(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
      [username, firstname, lastname, email, encryptedPassword]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "User registered successfully." });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong. Please try again later." });
  }
}

// login function

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter values for all fields." });
  }

  try {
    const [user] = await dbConnection.query(
      "SELECT username, userid, password FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid user credentials." });
    }

    const isSamePassword = await bcrypt.compare(password, user[0].password);

    if (!isSamePassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid user credentials." });
    }

    const { username, userid } = user[0];

    const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return res
      .status(StatusCodes.OK)
      .json({ msg: "User logged in successfully.", token, username, userid });
  } catch (error) {
    console.log(error.message);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong. Please try again later." });
  }
}

//   check function

async function checkUser(req, res) {
  const { username, userid } = req.user;

  return res
    .status(StatusCodes.OK)
    .json({ msg: "Access granted.", username, userid });
}

module.exports = { register, login, checkUser };
