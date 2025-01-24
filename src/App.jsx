import React from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import { Toaster } from "react-hot-toast"
import Header from "./components/Header"
import LandingPage from "./pages/LandingPage"
import StudentDashboard from "./pages/StudentDashboard"
import TeacherDashboard from "./pages/TeacherDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import Login from "./pages/Login"
import Register from "./pages/Register"
import PasswordReset from "./pages/PasswordReset"

function PrivateRoute({ children, allowedRoles }) {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" />
  }

  return children
}

function App() {
  const { currentUser } = useAuth()

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Toaster position="top-right" />
        {currentUser && <Header />}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={currentUser ? <Navigate to={`/${currentUser.role}`} /> : <LandingPage />} />
            <Route
              path="/student"
              element={
                <PrivateRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/teacher"
              element={
                <PrivateRoute allowedRoles={["teacher"]}>
                  <TeacherDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<PasswordReset />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

