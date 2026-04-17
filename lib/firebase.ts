import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCGNsZHlMxXS0lA-JYsFyUOvleGTJufBco",
  authDomain: "molddetectionpbl6.firebaseapp.com",
  projectId: "molddetectionpbl6",
  storageBucket: "molddetectionpbl6.firebasestorage.app",
  messagingSenderId: "859292008908",
  appId: "1:859292008908:web:ac283ae94201c58a961d69",
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)