import {Router} from 'express'
import { createTaskController, deleteAtaskController, getAllTaskController, updateTaskController } from './task.controller.js'
import { deleteAtask } from './task.services.js'
export const taskRoutes=Router()

taskRoutes.get('/tasks',getAllTaskController)
taskRoutes.post('/tasks',createTaskController)
taskRoutes.put('/tasks/:id',updateTaskController)
taskRoutes.delete('/tasks/:id',deleteAtaskController)