import React, { useEffect } from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import { Toaster } from "react-hot-toast"
import { getAuth, signInAnonymously } from "firebase/auth"
import { auth } from "./services/firebase"
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
  const { currentUser, loading } = useAuth()
  console.log('App render - loading:', loading, 'currentUser:', currentUser ? 'exists' : 'null');

  useEffect(() => {
    // Test Firebase connection
    const testConnection = async () => {
      try {
        console.log('Testing Firebase connection...');
        await signInAnonymously(auth);
        console.log('Firebase connection successful');
      } catch (error) {
        console.error('Firebase connection error:', error);
      }
    };
    
    testConnection();
  }, []);

  // Show loading spinner while authentication state is being determined
  if (loading) {
    console.log('Showing loading spinner');
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600">Loading...</p>
      </div>
    )
  }

  console.log('Rendering main app content');
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