import { createTaskService, deleteAtask, getAllTaskService, updateTask } from "./task.services.js"

export const getAllTaskController = async (req, res) => {
    const result = await getAllTaskService()
    res.json(result)
}
export const createTaskController = async (req, res) => {
    try {
        const result = await createTaskService(req.body)
        res.json(result)
    } catch (e) {
        console.log('ERROR AL CREAR TASK', e)
        res.status(500).json({ message: e.message })
    }
}
export const updateTaskController = async (req, res) => {
    try {
        const result = await updateTask(req.body, req.params.id)
        res.json(result)
    } catch (e) {
        console.log('ERROR AL EDITAR TASK', e)
        res.status(500).json({ message: e.message })
    }
}
export const deleteAtaskController = async (req, res) => {
    try {
        const result = await deleteAtask(req.params.id)
        res.json(result)
    } catch (e) {
        console.log('ERROR AL ELIMINAR TASK', e)
        res.status(500).json({ message: e.message })
    }
}