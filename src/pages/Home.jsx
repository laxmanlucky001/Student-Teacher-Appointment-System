import React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import styles from "../styles/Home.module.css"

const Home = () => {
  const { currentUser } = useAuth()

  return (
    <div className={styles.home}>
      <h1>Welcome to Student-Teacher Booking Appointment System</h1>
      {currentUser ? (
        <p>
          Hello, {currentUser.email}! Go to your <Link to={`/${currentUser.role}`}>Dashboard</Link>
        </p>
      ) : (
        <div>
          <p>Please select your role to proceed:</p>
          <nav className={styles.roleNav}>
            <Link to="/login" className={styles.roleLink}>
              Login
            </Link>
            <Link to="/register" className={styles.roleLink}>
              Register
            </Link>
          </nav>
        </div>
      )}
    </div>
  )
}

export default Home

