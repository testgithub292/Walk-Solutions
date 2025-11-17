// Firebase configuration
// Replace with your own Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMwLTuQknj0EMQ3mkP-5MROmHLuHyBjpg",
  authDomain: "tangi-reward.firebaseapp.com",
  projectId: "tangi-reward",
  storageBucket: "tangi-reward.firebasestorage.app",
  messagingSenderId: "1093613469246",
  appId: "1:1093613469246:web:bf441c3260568376775b6f",
  measurementId: "G-ETTF25SVXJ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();