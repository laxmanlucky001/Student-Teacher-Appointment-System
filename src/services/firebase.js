import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDtU1xcIkePU-4FWwemDKhyobvfIZn7Mpo",
  authDomain: "student-teacher-appointm-be560.firebaseapp.com",
  projectId: "student-teacher-appointm-be560",
  storageBucket: "student-teacher-appointm-be560.appspot.com",
  messagingSenderId: "273004934125",
  appId: "1:273004934125:web:eb045b8fddbd2b39f5ede4",
  measurementId: "G-Z8WHH384KW"
};

console.log('Initializing Firebase with config:', firebaseConfig);

let app;
try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully');
} catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
}

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
console.log('Auth initialized:', auth ? 'success' : 'failed');

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
console.log('Firestore initialized:', db ? 'success' : 'failed');

export { auth, db };
export default app;
