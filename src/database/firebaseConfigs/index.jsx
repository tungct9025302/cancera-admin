import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDVdjPQ445WtE8GJ56e66dXO39QQHaGQag",
  authDomain: "cancer-patient-management.firebaseapp.com",
  databaseURL:
    "https://cancer-patient-management-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cancer-patient-management",
  storageBucket: "cancer-patient-management.appspot.com",
  messagingSenderId: "752878770755",
  appId: "1:752878770755:web:52c42a80c142260a8892f6",
  measurementId: "G-FD6Q8EB0ZV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();

// import { initializeApp } from "firebase-admin";
// import { getAuth, deleteUser } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyDVdjPQ445WtE8GJ56e66dXO39QQHaGQag",
//   authDomain: "cancer-patient-management.firebaseapp.com",
//   databaseURL:
//     "https://cancer-patient-management-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "cancer-patient-management",
//   storageBucket: "cancer-patient-management.appspot.com",
//   messagingSenderId: "752878770755",
//   appId: "1:752878770755:web:52c42a80c142260a8892f6",
//   measurementId: "G-FD6Q8EB0ZV",
// };

// // Initialize Firebase
// const serviceAccount = require("../../../serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL:
//     "https://cancer-patient-management-default-rtdb.asia-southeast1.firebasedatabase.app",
// });

// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const auth = getAuth();
