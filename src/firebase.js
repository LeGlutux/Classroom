import firebase from 'firebase/app'
import 'firebase/auth'
import "firebase/firestore"

const config = {

  apiKey: "AIzaSyAfwQcpuB_DhRWWcP0ZaB277Al1OccJ-OY",
  authDomain: "classroom-48838.firebaseapp.com",
  databaseURL: "https://classroom-48838.firebaseio.com",
  projectId: "classroom-48838",
  storageBucket: "classroom-48838.appspot.com",
  messagingSenderId: "255308442151",
  appId: "1:255308442151:web:8d1fa28ac2beab7d83bc02",
  measurementId: "G-QMZXM5QL8Z"
}


const Firebase = firebase.initializeApp(config)

// connects to firebase emulators

// if (window.location.hostname === "localhost") {
//   Firebase.auth().useEmulator("http://localhost:9099")
//   firebase.firestore().settings({ host: 'localhost:8080', ssl: false })

// }

export default Firebase