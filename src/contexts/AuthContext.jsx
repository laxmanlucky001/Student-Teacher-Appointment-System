import React, { createContext, useContext, useState, useEffect } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "../services/firebase"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function signup(name, email, password, role) {
    try {
      console.log('Starting signup process...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created successfully:', userCredential.user.uid);
      
      const userData = {
        name,
        email,
        role,
        approved: role === "student" ? true : false,
      };
      
      await setDoc(doc(db, "users", userCredential.user.uid), userData);
      console.log('User document created in Firestore');
      
      // Set the current user with combined auth and custom data
      setCurrentUser({ ...userCredential.user, ...userData });
      
      return userCredential;
    } catch (error) {
      console.error('Signup error:', error.code, error.message);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      console.log('Attempting login for', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (!userDoc.exists()) {
        console.error('No user document found for this user.');
        setCurrentUser(userCredential.user);
        return userCredential;
      }
      const userData = userDoc.data();
      if (!userData.role) {
        console.error('User document missing role field:', userData);
      }
      if (userData.role === 'teacher' && userData.approved === false) {
        console.warn('Teacher account not approved yet.');
      }
      setCurrentUser({ ...userCredential.user, ...userData });
      return userCredential;
    } catch (error) {
      console.error('Login error:', error.code, error.message);
      throw error;
    }
  }

  function logout() {
    return signOut(auth)
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? `User ${user.uid} logged in` : 'No user');
      
      try {
        if (user) {
          const docRef = doc(db, "users", user.uid);
          console.log('Fetching user data from Firestore...');
          
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log('User data found:', userData);
            setCurrentUser({ ...user, ...userData });
          } else {
            console.log('No user data found in Firestore');
            setCurrentUser(user);
          }
        } else {
          console.log('Setting current user to null');
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error in auth state listener:', error);
        setCurrentUser(null);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    });

    return () => {
      console.log('Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

