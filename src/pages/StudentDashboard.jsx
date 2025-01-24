import React, { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "../services/firebase"
import toast from "react-hot-toast"
import { format, parseISO } from "date-fns"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import Messages from "../components/Messages"

const StudentDashboard = () => {
  const { currentUser } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [teachers, setTeachers] = useState([])
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [appointmentDate, setAppointmentDate] = useState(new Date())
  const [appointmentTime, setAppointmentTime] = useState("")
  const [appointmentPurpose, setAppointmentPurpose] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  useEffect(() => {
    fetchAppointments()
    fetchTeachers()
  }, [currentUser])

  const fetchAppointments = async () => {
    try {
      const appointmentsRef = collection(db, "appointments")
      const q = query(appointmentsRef, where("studentId", "==", currentUser.uid))
      const querySnapshot = await getDocs(q)
      setAppointments(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error("Error fetching appointments:", error)
      toast.error("Failed to load appointments")
    } finally {
      setLoading(false)
    }
  }

  const fetchTeachers = async () => {
    try {
      const teachersRef = collection(db, "users")
      const q = query(teachersRef, where("role", "==", "teacher"))
      const querySnapshot = await getDocs(q)
      setTeachers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error("Error fetching teachers:", error)
      toast.error("Failed to load teachers")
    }
  }

  const bookAppointment = async (e) => {
    e.preventDefault()
    if (!selectedTeacher || !appointmentDate || !appointmentTime || !appointmentPurpose) {
      return toast.error("Please fill in all fields")
    }

    try {
      const newAppointment = {
        teacherId: selectedTeacher,
        teacherName: teachers.find((t) => t.id === selectedTeacher)?.name,
        studentId: currentUser.uid,
        studentName: currentUser.name,
        date: format(appointmentDate, "yyyy-MM-dd"),
        time: appointmentTime,
        purpose: appointmentPurpose,
        status: "pending",
      }

      await addDoc(collection(db, "appointments"), newAppointment)
      toast.success("Appointment booked successfully!")
      fetchAppointments()
      setSelectedTeacher("")
      setAppointmentDate(new Date())
      setAppointmentTime("")
      setAppointmentPurpose("")
    } catch (error) {
      console.error("Error booking appointment:", error)
      toast.error("Failed to book appointment")
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      await deleteDoc(doc(db, "appointments", appointmentId))
      toast.success("Appointment cancelled successfully!")
      fetchAppointments()
    } catch (error) {
      console.error("Error cancelling appointment:", error)
      toast.error("Failed to cancel appointment")
    }
  }

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Welcome, {currentUser.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Book an Appointment</h2>
          <form onSubmit={bookAppointment} className="space-y-4">
            <div>
              <label htmlFor="teacher" className="block mb-1 font-medium">
                Select Teacher:
              </label>
              <select
                id="teacher"
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a Teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block mb-1 font-medium">
                Date:
              </label>
              <Calendar onChange={setAppointmentDate} value={appointmentDate} className="w-full border rounded-md" />
            </div>
            <div>
              <label htmlFor="time" className="block mb-1 font-medium">
                Time:
              </label>
              <input
                type="time"
                id="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="purpose" className="block mb-1 font-medium">
                Purpose:
              </label>
              <textarea
                id="purpose"
                value={appointmentPurpose}
                onChange={(e) => setAppointmentPurpose(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Book Appointment
            </button>
          </form>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Your Appointments</h2>
          {appointments.length === 0 ? (
            <p>You have no appointments scheduled.</p>
          ) : (
            <ul className="space-y-4">
              {appointments.map((appointment) => (
                <li key={appointment.id} className="border-b pb-4">
                  <p>
                    <strong>Teacher:</strong> {appointment.teacherName}
                  </p>
                  <p>
                    <strong>Date:</strong> {format(parseISO(appointment.date), "MMMM d, yyyy")}
                  </p>
                  <p>
                    <strong>Time:</strong> {appointment.time}
                  </p>
                  <p>
                    <strong>Purpose:</strong> {appointment.purpose}
                  </p>
                  <p>
                    <strong>Status:</strong> {appointment.status}
                  </p>
                  {appointment.status === "pending" && (
                    <button
                      onClick={() => cancelAppointment(appointment.id)}
                      className="mt-2 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-300"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedAppointment(appointment)}
                    className="mt-2 ml-2 bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition duration-300"
                  >
                    Messages
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {selectedAppointment && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Messages for Appointment with {selectedAppointment.teacherName}</h2>
          <Messages appointmentId={selectedAppointment.id} />
          <button
            onClick={() => setSelectedAppointment(null)}
            className="mt-4 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300"
          >
            Close Messages
          </button>
        </div>
      )}
    </div>
  )
}

export default StudentDashboard

