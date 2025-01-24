import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import toast from "react-hot-toast"

const PasswordReset = () => {
  const [email, setEmail] = useState("")
  const { resetPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await resetPassword(email)
      toast.success("Password reset email sent")
    } catch (error) {
      toast.error("Failed to send password reset email")
      console.error(error)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Send Reset Email
        </button>
      </form>
      <div className="mt-4 text-center">
        <Link to="/login" className="text-blue-500 hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  )
}

export default PasswordReset

