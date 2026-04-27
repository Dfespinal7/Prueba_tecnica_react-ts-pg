import express from 'express'
import morgan from 'morgan'
import  cors from 'cors'
import dotenv from 'dotenv'
import { taskRoutes } from './modules/task/task.routes.js'
dotenv.config()
const app=express()

app.use(express.json())
app.use(morgan('dev'))
app.use(cors({
    origin:'http://localhost:5173'
}))
app.use(taskRoutes)

app.get('/',(req,res)=>{
    res.status(200).json({message:'mensaje enviado correctamente'})
})
const SERVER=process.env.PORT
app.listen(SERVER,()=>{
    console.log(`server ${SERVER} CORRIENDO`)
})