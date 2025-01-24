import React, { useState, useEffect } from "react"
import { collection, query, where, orderBy, addDoc, onSnapshot } from "firebase/firestore"
import { db } from "../services/firebase"
import { useAuth } from "../contexts/AuthContext"
import { format } from "date-fns"

const Messages = ({ appointmentId }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const { currentUser } = useAuth()

  useEffect(() => {
    const messagesRef = collection(db, "messages")
    const q = query(messagesRef, where("appointmentId", "==", appointmentId), orderBy("timestamp"))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setMessages(fetchedMessages)
    })

    return () => unsubscribe()
  }, [appointmentId])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (newMessage.trim() === "") return

    try {
      await addDoc(collection(db, "messages"), {
        appointmentId,
        senderId: currentUser.uid,
        senderName: currentUser.name,
        content: newMessage,
        timestamp: new Date(),
      })
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-xl font-bold mb-4">Messages</h3>
      <div className="h-64 overflow-y-auto mb-4">
        {messages.map((message) => (
          <div key={message.id} className={`mb-2 ${message.senderId === currentUser.uid ? "text-right" : "text-left"}`}>
            <p className="inline-block bg-gray-100 rounded-lg py-2 px-3 max-w-xs">
              <span className="font-semibold">{message.senderName}: </span>
              {message.content}
            </p>
            <p className="text-xs text-gray-500 mt-1">{format(message.timestamp.toDate(), "MMM d, yyyy HH:mm")}</p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300"
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default Messages

