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
import CalendarPage from "../pages/dashboards/CalendarPage"
import ModulesPage from "../pages/dashboards/ModulesPage"
import SubjectPage from "../components/subjects/SubjectPage"
import LevelPage from "../components/subjects/LevelPage"
import ModulePage from "../components/subjects/ModulePage"

const AppRouter = () => {
  const { token, user } = useContext(AuthContext)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {token ? <NavBarPrivate /> : <NavBarPublic />}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
            <Route index element={<Navigate to={user?.role === 'teacher' ? 'calendar' : 'modules'} replace />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="modules" element={<ModulesPage />} />
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
