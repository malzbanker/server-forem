const mysql2 = require("mysql2");
const dbConnection = mysql2.createPool({
    user: process.env.USER,
    database: process.env.DATABASE,
    host: "localhost",
    password: process.env.PASSWORD,
    connection:10
})
console.log(process.env.PASSWORD)
// dbConnection.execute("select 'test' ", (err, result) => {
//     if (err) {
//         console.log(err.message)
//     } else {
//         console.log(result)
//     }
// })


// let users = `CREATE TABLE if not exists users(
//     userid int(30) NOT NULL auto_increment,
//     username varchar(30) not null,
//     firstname varchar(30) not null,
//     lastname varchar(30) not null,
//     email varchar(30) not null,
//     password varchar(100) not null,
//     PRIMARY KEY (userid)
// )`;


// let questions = `CREATE TABLE if not exists questions(
//     id int(20) not null auto_increment,
//     questionid varchar(100) not null UNIQUE,
//     userid int(30) not null,
//     title varchar(100) not null,
//     description varchar(255) not null,
//     tag varchar(20),
   
//     PRIMARY KEY(id,questionid),
//     FOREIGN KEY (userid) REFERENCES users(userid)
// )`;


// let answers = `CREATE TABLE if not exists answers(
//     answerid int(30) auto_increment,
//     userid int(30) not null,
//     questionid varchar(100) not null,
//     answer varchar(255) not null,
//     PRIMARY KEY(answerid),
//     FOREIGN KEY (userid) REFERENCES users(userid),
//     FOREIGN KEY (questionid) REFERENCES questions(questionid)
// )`;

// dbconnection.query(users, (err, res) => {
//     if (err) throw err;
//     console.log("user table created");
//   });

// dbconnection.query(questions, (err, res) => {
//     if (err) throw err;
//     console.log("questions table created");
//   });

// dbconnection.query(answers, (err, res) => {
//     if (err) throw err;
//     console.log("answers table created");
//   });

module.exports=dbConnection.promise()