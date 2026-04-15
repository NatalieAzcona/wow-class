import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import Register from "../pages/Register"
import Login from "../pages/Login"
import NavBarPublic from "../layout/public/NavBarPublic"


const AppRouter = () => {
  return (
    <>
      <NavBarPublic />
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
      </Routes>
    </>
  )
}

export default AppRouter
