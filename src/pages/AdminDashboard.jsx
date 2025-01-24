import React, { useState, useEffect } from "react"
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore"
import { db } from "../services/firebase"
import toast from "react-hot-toast"

const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
    fetchAppointments()
  }, [])

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("role", "in", ["student", "teacher"]))
      const querySnapshot = await getDocs(q)
      setUsers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const fetchAppointments = async () => {
    try {
      const appointmentsRef = collection(db, "appointments")
      const querySnapshot = await getDocs(appointmentsRef)
      setAppointments(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error("Error fetching appointments:", error)
      toast.error("Failed to load appointments")
    }
  }

  const approveUser = async (userId) => {
    try {
      await updateDoc(doc(db, "users", userId), { approved: true })
      toast.success("User approved")
      fetchUsers()
    } catch (error) {
      console.error("Error approving user:", error)
      toast.error("Failed to approve user")
    }
  }

  const deleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId))
      toast.success("User deleted")
      fetchUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Failed to delete user")
    }
  }

  const getAppointmentStats = () => {
    const total = appointments.length
    const pending = appointments.filter((a) => a.status === "pending").length
    const approved = appointments.filter((a) => a.status === "approved").length
    const rejected = appointments.filter((a) => a.status === "rejected").length

    return { total, pending, approved, rejected }
  }

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>
  }

  const stats = getAppointmentStats()

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">User Management</h2>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <ul className="space-y-4">
              {users.map((user) => (
                <li key={user.id} className="border-b pb-4">
                  <p>
                    <strong>Name:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {user.role}
                  </p>
                  <p>
                    <strong>Approved:</strong> {user.approved ? "Yes" : "No"}
                  </p>
                  {!user.approved && (
                    <button
                      onClick={() => approveUser(user.id)}
                      className="mt-2 bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 transition duration-300"
                    >
                      Approve User
                    </button>
                  )}
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="mt-2 ml-2 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Delete User
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Appointment Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-100 p-4 rounded-md">
              <p className="text-lg font-semibold">Total Appointments</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-md">
              <p className="text-lg font-semibold">Pending Appointments</p>
              <p className="text-3xl font-bold">{stats.pending}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-md">
              <p className="text-lg font-semibold">Approved Appointments</p>
              <p className="text-3xl font-bold">{stats.approved}</p>
            </div>
            <div className="bg-red-100 p-4 rounded-md">
              <p className="text-lg font-semibold">Rejected Appointments</p>
              <p className="text-3xl font-bold">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

