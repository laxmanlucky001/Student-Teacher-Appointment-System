import React, { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { collection, query, where, getDocs, updateDoc, doc, addDoc, deleteDoc } from "firebase/firestore"
import { db } from "../services/firebase"
import toast from "react-hot-toast"
import { format, parseISO } from "date-fns"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import Messages from "../components/Messages"

const TeacherDashboard = () => {
  const { currentUser } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [availableSlots, setAvailableSlots] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  useEffect(() => {
    fetchAppointments()
    fetchAvailableSlots()
  }, [currentUser])

  const fetchAppointments = async () => {
    try {
      const appointmentsRef = collection(db, "appointments")
      const q = query(appointmentsRef, where("teacherId", "==", currentUser.uid))
      const querySnapshot = await getDocs(q)
      setAppointments(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error("Error fetching appointments:", error)
      toast.error("Failed to load appointments")
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableSlots = async () => {
    try {
      const slotsRef = collection(db, "availableSlots")
      const q = query(slotsRef, where("teacherId", "==", currentUser.uid))
      const querySnapshot = await getDocs(q)
      setAvailableSlots(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error("Error fetching available slots:", error)
      toast.error("Failed to load available slots")
    }
  }

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await updateDoc(doc(db, "appointments", appointmentId), { status: newStatus })
      toast.success(`Appointment ${newStatus}`)
      fetchAppointments()
    } catch (error) {
      console.error("Error updating appointment status:", error)
      toast.error("Failed to update appointment status")
    }
  }

  const addAvailableSlot = async (e) => {
    e.preventDefault()
    if (!startTime || !endTime) {
      return toast.error("Please fill in all fields")
    }

    try {
      const newSlot = {
        teacherId: currentUser.uid,
        date: format(selectedDate, "yyyy-MM-dd"),
        startTime,
        endTime,
      }

      await addDoc(collection(db, "availableSlots"), newSlot)
      toast.success("Available slot added successfully!")
      fetchAvailableSlots()
      setStartTime("")
      setEndTime("")
    } catch (error) {
      console.error("Error adding available slot:", error)
      toast.error("Failed to add available slot")
    }
  }

  const deleteAvailableSlot = async (slotId) => {
    try {
      await deleteDoc(doc(db, "availableSlots", slotId))
      toast.success("Available slot deleted successfully!")
      fetchAvailableSlots()
    } catch (error) {
      console.error("Error deleting available slot:", error)
      toast.error("Failed to delete available slot")
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
          <h2 className="text-2xl font-bold mb-4">Your Appointments</h2>
          {appointments.length === 0 ? (
            <p>You have no appointments scheduled.</p>
          ) : (
            <ul className="space-y-4">
              {appointments.map((appointment) => (
                <li key={appointment.id} className="border-b pb-4">
                  <p>
                    <strong>Student:</strong> {appointment.studentName}
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
                    <div className="mt-2 space-x-2">
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, "approved")}
                        className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 transition duration-300"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, "rejected")}
                        className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-300"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedAppointment(appointment)}
                    className="mt-2 bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition duration-300"
                  >
                    Messages
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Manage Available Slots</h2>
          <form onSubmit={addAvailableSlot} className="space-y-4 mb-6">
            <div>
              <label htmlFor="date" className="block mb-1 font-medium">
                Date:
              </label>
              <Calendar onChange={setSelectedDate} value={selectedDate} className="w-full border rounded-md" />
            </div>
            <div>
              <label htmlFor="startTime" className="block mb-1 font-medium">
                Start Time:
              </label>
              <input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block mb-1 font-medium">
                End Time:
              </label>
              <input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Add Available Slot
            </button>
          </form>
          <h3 className="text-xl font-bold mb-2">Available Slots</h3>
          {availableSlots.length === 0 ? (
            <p>No available slots set.</p>
          ) : (
            <ul className="space-y-2">
              {availableSlots.map((slot) => (
                <li key={slot.id} className="flex justify-between items-center">
                  <span>
                    {format(parseISO(slot.date), "MMMM d, yyyy")} - {slot.startTime} to {slot.endTime}
                  </span>
                  <button
                    onClick={() => deleteAvailableSlot(slot.id)}
                    className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 transition duration-300 text-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {selectedAppointment && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Messages for Appointment with {selectedAppointment.studentName}</h2>
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

export default TeacherDashboard

