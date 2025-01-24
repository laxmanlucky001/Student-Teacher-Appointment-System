import firebase from "firebase/app"
import "firebase/firestore"

const firestore = firebase.firestore()

export const addMessage = async (appointmentId, message) => {
  const { text, senderId } = message
  if (!text || !senderId) {
    throw new Error("Message text and senderId are required")
  }
  return firestore.collection("messages").add({
    appointmentId,
    text,
    senderId,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  })
}

//Example usage
// async function sendMessage(){
//   try{
//     const message = await addMessage("123", {text: "Hello", senderId: "user123"});
//     console.log("Message added with ID:", message.id);
//   } catch (error){
//     console.error("Error adding message:", error);
//   }
// }

// sendMessage();

