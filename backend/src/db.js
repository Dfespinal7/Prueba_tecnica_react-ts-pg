import {Pool} from 'pg'
import dotenv from 'dotenv'
dotenv.config()

export const pool=new Pool({
    user:process.env.USER_DB,
    password:process.env.PASSWORD,
    host:process.env.HOST,
    port:process.env.PORT_DB,
    database:process.env.DATABASE
})