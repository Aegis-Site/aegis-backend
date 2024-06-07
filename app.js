import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import validateKey from './middleware/validateKey.js'
import fileReport from './routes/api/fileReport.js'
import { DBinit } from './utils/DB.js'

DBinit()
dotenv.config()

const app = express()

app.use(cors())

app.use("/api", validateKey, fileReport)

app.listen(process.env.SERVER_PORT, () => { 
    console.log("Server Running on port " + process.env.SERVER_PORT)
})