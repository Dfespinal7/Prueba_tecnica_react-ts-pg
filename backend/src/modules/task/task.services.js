import { pool } from "../../db.js"

export const getAllTaskService = async () => {
    const getTasks = await pool.query('SELECT * FROM tasks ORDER BY id asc')
    return getTasks.rows
}
export const createTaskService = async ({ title, description, status }) => {
    if (!title) {
        throw new Error('TITLE NOT FOUND')
    } if (!status && !description) {
        const createTask = await pool.query('INSERT INTO tasks (title)VALUES($1) RETURNING *', [title.toLowerCase()])
        return { message: 'task insertada correctamente', task: createTask.rows[0] }
    }
    if (!status) {
        const createTask = await pool.query('INSERT INTO tasks (title,description)VALUES($1,$2) RETURNING *', [title.toLowerCase(), description.toLowerCase()])
        return { message: 'task insertada correctamente', task: createTask.rows[0] }
    }
    if (!description) {
        const createTask = await pool.query('INSERT INTO tasks (title,status)VALUES($1,$2) RETURNING *', [title.toLowerCase(), status.toLowerCase()])
        return { message: 'task insertada correctamente', task: createTask.rows[0] }
    }
    const statusAllowed=["pending","in_progress","donde","completed"]
    if(!statusAllowed.includes(status.toLowerCase())){
        throw new Error('STATUS_NOT_VALID')
    }
    const createTask = await pool.query('INSERT INTO tasks (title,description,status)VALUES($1,$2,$3) RETURNING *', [title.toLowerCase(), description.toLowerCase(), status.toLowerCase()])
    return { message: 'task insertada correctamente', task: createTask.rows[0] }

}

export const updateTask = async({ title, description, status },task_id) => {
    if (!title || !description || !status) {
        throw new Error ('PARAMS_NOT_FOUND')
    }
    const validTask=await pool.query('select id from tasks where id=$1',[task_id])
    if(validTask.rows.length===0){
        throw new Error ('TASK_NOT_FOUND')
    }
    const statusAllowed=["pending","in_progress","donde","completed"]
    if(!statusAllowed.includes(status.toLowerCase())){
        throw new Error('STATUS_NOT_VALID')
    }
    const result=await pool.query('UPDATE tasks set title=$1,description=$2,status=$3 WHERE id=$4 RETURNING *',[title.toLowerCase(),description.toLowerCase(),status.toLowerCase(),task_id])
    return {message:'Task editado correctamente',task:result.rows[0]}
}

export const deleteAtask=async(task_id)=>{
    const validTask=await pool.query('select id from tasks where id=$1',[task_id])
    if(validTask.rows.length===0){
        throw new Error('TASK_NOT_FOUND')
    }
    const deleteRegister=await pool.query('DELETE FROM tasks where id=$1',[task_id])
    return {message:'Task eliminada correctamente'}
}