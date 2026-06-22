import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import Register from "../pages/Register"
import Login from "../pages/Login"
import NavBarPublic from "../layout/public/NavBarPublic"
import Footer from "../layout/public/Footer"
import WhatsAppButton from "../components/WhatsAppButton"
import PrivateRoute from "./PrivateRoute"
import Dashboard from "../pages/Dashboard"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import NavBarPrivate from "../layout/private/NavBarPrivate"
import SubjectPage from "../components/subjects/SubjectPage"

const AppRouter = () => {

const { token } = useContext(AuthContext)


  return (
    <>
      { token ? <NavBarPrivate/> : <NavBarPublic />}
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>}></Route>
        <Route path="/subject/:subject" element={<PrivateRoute><SubjectPage/></PrivateRoute>}></Route>
      </Routes>
      <Footer/>
      <WhatsAppButton />
    </>
  )
}

export default AppRouter
