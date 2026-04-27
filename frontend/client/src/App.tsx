import { BrowserRouter, Route, Routes } from "react-router-dom";
import TaskList from "./components/TaskList";

export default function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TaskList></TaskList>}></Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}
