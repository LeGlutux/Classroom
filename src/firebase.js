import firebase from 'firebase/app'
import 'firebase/auth'
import "firebase/firestore"

// Fallback vers les valeurs d'origine si les variables d'environnement ne sont pas définies
const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyAfwQcpuB_DhRWWcP0ZaB277Al1OccJ-OY",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "classroom-48838.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://classroom-48838.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "classroom-48838",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "classroom-48838.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "255308442151",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:255308442151:web:8d1fa28ac2beab7d83bc02",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-QMZXM5QL8Z"
}


const Firebase = firebase.initializeApp(config)

// connects to firebase emulators

// if (window.location.hostname === "localhost") {
//   Firebase.auth().useEmulator("http://localhost:9099")
//   firebase.firestore().settings({ host: 'localhost:8080', ssl: false })

// }

export default Firebase