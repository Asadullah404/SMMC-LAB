// // ✅ Import Firebase SDKs
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

// // ✅ Replace these values with your INVENTORY Firebase project credentials
// const firebaseConfig = {
//     apiKey: import.meta.env.VITE_FIREBASE_API_KEY2,
//     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN2,
//    // databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL, // optional (Realtime DB)
//     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID2,
//     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET2,
//     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID2,
//     appId: import.meta.env.VITE_FIREBASE_APP_ID2,
//   };
  

// // ✅ Initialize the second Firebase app (for inventory)
// const inventoryApp = initializeApp(inventoryFirebaseConfig, "inventoryApp");

// // ✅ Export the Firestore instance of that project
// export const inventoryDB = getFirestore(inventoryApp);

// ✅ Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ✅ Use environment variables for your second Firebase project
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY2,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN2,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID2,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET2,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID2,
  appId: import.meta.env.VITE_FIREBASE_APP_ID2,
};

// ✅ Initialize this second Firebase app (for INVENTORY)
const inventoryApp = initializeApp(firebaseConfig, "inventoryApp");

// ✅ Export Firestore instance for that app
export const inventoryDB = getFirestore(inventoryApp);
