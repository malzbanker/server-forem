// dbconnection
const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


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
        .json({ msg: "password is not the same." });
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
