require("dotenv").config()
const express = require("express");
const bodyparser = require('body-parser');
const app = express();
const port=5500

const cors = require('cors')
app.use(cors())
app.use(bodyparser.urlencoded({extended:true}))


// dbconnection
const dbConnection=require('./db/dbConfig')



// user routes middleware file

const userRoutes = require("./routes/userRoute")
const questionRouts = require("./routes/questionRouter")
const answerRouters=require("./routes/answerRouter")

// json middleware to extract json data
app.use(express.json())



// user middleware
app.use("/api/users", userRoutes)
app.use("/api/questions", questionRouts)
app.use("/api/answers",answerRouters)

async function start() {
    try {
        const result = await dbConnection.execute("select 'test' ")
        await app.listen(port)
        console.log("database connection established")
        console.log(`listning on ${port}`);
    } catch (error) {
        console.log(error.message)
    }
}
start()




