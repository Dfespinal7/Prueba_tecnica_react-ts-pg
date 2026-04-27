import React, { useEffect, useState } from "react"
import Swal from "sweetalert2"
type TasksProps = {
    id: number,
    title: string
    description: string | null
    status: "in_progress" | "pending" | "donde" | "completed"
    created_at: string | null
}
export default function TaskList() {
    const [allTask, setAllTask] = useState<TasksProps[]>([])
    const [filtrados, setFiltrados] = useState<TasksProps[]>([])
    const [taskObject, setTaskObject] = useState<TasksProps>({ id: 0, title: '', description: null, status: 'pending', created_at: null })
    const [filtroStatus,setFiltroStatus]=useState<string>('todos')
    const filtros=['todos','pending','in_progress','completed']
    const getAllTask = async () => {
        const result = await fetch('http://localhost:5000/tasks', {
            method: 'GET'
        })
        const data = await result.json()
        if (!result.ok) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: data.message || 'error al obtener info',
                showConfirmButton: false,
                timer: 2000
            })
            return
        }
        setAllTask(data)
        setFiltrados(data)

    }
    const handleChangheInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setTaskObject({ ...taskObject, [e.target.name]: e.target.value })
    }

    

    const handleSumbitTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!taskObject.title.trim()) {
            Swal.fire({
                icon: 'info',
                title: 'ERROR',
                text: 'Debe ingresar el titulo de la tarea!',
            })
            return
        }
        const result = await fetch('http://localhost:5000/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskObject)
        })
        const data = await result.json()
        if (!result.ok) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: data.message || 'error al obtener info',
                showConfirmButton: false,
                timer: 2000
            })
            return
        }
        setTaskObject({ id: 0, title: '', description: null, status: 'pending', created_at: null })
        getAllTask()
        Swal.fire({
            icon: 'success',
            title: 'Todo salió bien!',
            text: data.message || 'error al obtener info',
            showConfirmButton: false,
            timer: 2000
        })
    }
    const deleteTask = async (id: number) => {

        const validQuestions = await Swal.fire({
            icon: 'question',
            title: 'Seguro que desea eliminar esta tarea?',
            showConfirmButton: true,
            showCancelButton: true

        })
        if (validQuestions.isConfirmed) {
            const result = await fetch(`http://localhost:5000/tasks/${id}`, {
                method: 'delete'
            })
            const data = await result.json()
            if (!result.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'error',
                    text: data.message || 'error al obtener info',
                    showConfirmButton: false,
                    timer: 2000
                })
                return
            }
            setFiltroStatus('todos')
            getAllTask()
            Swal.fire({
                icon: 'success',
                title: 'Tarea eliminada!',
                text: data.message || 'error al obtener info',
                showConfirmButton: false,
                timer: 2000
            })
        }
    }
    const changeStatus=async(id:number,status:string)=>{
        console.log(id,status)
        let taskToEdit=allTask.find(task=>task.id===id)
        let newStatus=null
        if(status==='pending'){
            newStatus='in_progress'
        }else if(status==='in_progress'){
            newStatus='donde'
        }else{
            newStatus='pending'
        }
        const taskmod={...taskToEdit,status:newStatus}
        await fetch(`http://localhost:5000/tasks/${id}`,{
            method:'PUT',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(taskmod)
        })
        setFiltroStatus('todos')
        getAllTask()
        
    }
    const applyFilter=()=>{
        let filtroMod=filtroStatus==='completed'?'donde':filtroStatus
        if(filtroStatus!=='todos'){
            setFiltrados(allTask.filter(task=>task.status===filtroMod))
        }else{
            setFiltrados(allTask)
        }
    }
    useEffect(() => {
        getAllTask()
    }, [])
    useEffect(()=>{
        applyFilter()
    },[filtroStatus])
    return (
        <div className="bg-white flex justify-center items-center flex-col h-screen gap-2">
            <div className="h-20 border w-[60%] rounded-lg border-gray-200">
                <form className=" h-full border-amber-400 flex" onSubmit={handleSumbitTask}>
                    <div className=" w-full px-2 py-1 flex flex-col gap-1">
                        <label className="font-bold text-gray-500">Title</label>
                        <input value={taskObject.title} onChange={handleChangheInput} name="title" type="text" className="text-gray-400 border px-2 py-1 rounded-lg border-gray-300" />
                    </div>
                    <div className=" w-full px-2 py-1 flex flex-col gap-1">
                        <label className="font-bold text-gray-500">Description</label>
                        <input value={taskObject.description || ''} onChange={handleChangheInput} name="description" type="text" className="text-gray-400 border px-2 py-1 rounded-lg border-gray-300" />
                    </div>
                    <div className=" w-full px-2 py-1 flex flex-col gap-1">
                        <label className="font-bold text-gray-500">Status</label>
                        <select id="" className="border px-2 py-1 rounded-lg border-gray-300 text-gray-400" onChange={handleChangheInput} name="status">
                            <option value="pending">seleccione estado</option>
                            <option value="pending">pending</option>
                            <option value="in_progress">in progress</option>
                            <option value="donde">done</option>
                        </select>
                    </div>
                    <div className="w-full flex justify-center items-center">
                        <button className={` p-2 rounded-lg font-bold text-white  ${taskObject.title ? 'bg-green-300 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'}`}>Add task</button>
                    </div>
                </form>
            </div>
            <div className="w-[70%] flex px-2 justify-between">
                {
                    filtros.map((filtro,index)=>(
                        <div key={index} onClick={()=>setFiltroStatus(filtro)} className={filtro===filtroStatus?`bg-green-200 p-1 rounded-lg font-bold`:`font-bold bg-gray-200 p-1 rounded-lg`}>{filtro}</div>
                    ))
                }
            </div>
            <div className=" h-[60%] overflow-auto w-[70%]">
                <table className="border w-full border-collapse rounded-lg overflow-hidden shadow-lg ">
                    <thead className="bg-blue-400 uppercase text-white">
                        <tr>
                            <th className="p-3 text-center font-bold">id</th>
                            <th className="p-3 text-center font-bold">title</th>
                            <th className="p-3 text-center font-bold">description</th>
                            <th className="p-3 text-center font-bold">status</th>
                            <th className="p-3 text-center font-bold">DATE</th>
                            <th className="p-3 text-center font-bold">action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filtrados.map(task => (
                                <tr key={task.id} className="odd:bg-gray-50 even:bg-white hover:bg-gray-200">
                                    <td className="p-3 text-center text-gray-700 font-semibold">{task.id}</td>
                                    <td className="p-3 text-center text-gray-700 font-semibold">{task.title}</td>
                                    <td className="p-3 text-center text-gray-700 font-semibold">{task.description || 'without description'}</td>
                                    <td onClick={()=>changeStatus(task.id,task.status)} className={`p-3 text-center text-gray-700 font-semibold cursor-pointer`}><span className={` p-1 rounded-lg text-sm ${task.status === 'pending' ? 'bg-red-300 text-red-500' : task.status === 'in_progress' ? 'bg-amber-300 text-amber-500' : 'bg-green-300 text-green-500'}`}>{task.status === 'donde' ? 'completed' : task.status}</span></td>
                                    <td className="p-3 text-center text-gray-700 font-semibold">{task.created_at ? new Date(task.created_at).toLocaleDateString('es-CO') : ''}</td>
                                    <td className="p-3 text-center text-gray-700 font-semibold"><button onClick={() => { deleteTask(task.id) }} className="bg-red-300 p-1 rounded-lg text-white cursor-pointer font-bold hover:scale-105 transition-all duration-500">Delete Task</button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
