import { collection, addDoc, updateDoc, deleteDoc, getDocs, query, where, doc } from "firebase/firestore"
import { db } from "./firebase"

export const addTeacher = (teacherData) => {
  return addDoc(collection(db, "teachers"), teacherData)
}

export const updateTeacher = (teacherId, updatedData) => {
  const teacherRef = doc(db, "teachers", teacherId)
  return updateDoc(teacherRef, updatedData)
}

export const deleteTeacher = (teacherId) => {
  const teacherRef = doc(db, "teachers", teacherId)
  return deleteDoc(teacherRef)
}

export const approveStudent = (studentId) => {
  const studentRef = doc(db, "users", studentId)
  return updateDoc(studentRef, { approved: true })
}

export const getTeachers = () => {
  return getDocs(collection(db, "teachers"))
}

export const getPendingStudents = () => {
  const q = query(collection(db, "users"), where("role", "==", "student"), where("approved", "==", false))
  return getDocs(q)
}

