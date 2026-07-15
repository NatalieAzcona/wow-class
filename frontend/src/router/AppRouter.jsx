import { Route, Routes, Navigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import Home from "../pages/Home"
import Register from "../pages/Register"
import Login from "../pages/Login"
import NavBarPublic from "../layout/public/NavBarPublic"
import NavBarPrivate from "../layout/private/NavBarPrivate"
import Footer from "../layout/public/Footer"
import WhatsAppButton from "../components/WhatsAppButton"
import PrivateRoute from "./PrivateRoute"
import Dashboard from "../pages/Dashboard"
import ModulesPage from "../pages/dashboards/ModulesPage"
import SubjectPage from "../components/subjects/SubjectPage"
import LevelPage from "../components/subjects/LevelPage"
import ModulePage from "../components/subjects/ModulePage"
import ProfilePage from "../pages/dashboards/ProfilePage"
import AvisoLegal from "../pages/legal/AvisoLegal"
import Privacidad from "../pages/legal/Privacidad"
import Cookies from "../pages/legal/Cookies"

const AppRouter = () => {
  const { token } = useContext(AuthContext)

  return (
    <div className="app-layout">
      {token ? <NavBarPrivate /> : <NavBarPublic />}
      <main className="app-main">
        <Routes>
          <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/aviso-legal" element={<AvisoLegal />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
            <Route index element={<Navigate to="subjects" replace />} />
            <Route path="subjects" element={<ModulesPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="subject/:subject" element={<SubjectPage />} />
            <Route path="subject/:subject/:level" element={<LevelPage />} />
            <Route path="subject/:subject/:level/:moduleId" element={<ModulePage />} />
          </Route>
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default AppRouter
