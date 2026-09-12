import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

/**
 * CONFIGURACIÓN DE FIREBASE PARA: HOSPITAL GENERAL DE MEDELLÍN (HGM)
 * 
 * INSTRUCCIONES:
 * 1. Ve a Firebase Console: https://console.firebase.google.com/
 * 2. Crea un proyecto nuevo (ejemplo: "evaluacion-residentes-hgm").
 * 3. En la vista principal del proyecto, añade una aplicación Web (ícono </>) y asígnale un apodo.
 * 4. Copia el objeto firebaseConfig generado por Firebase y reemplaza los valores a continuación.
 */
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto-hgm.firebaseapp.com",
  projectId: "tu-proyecto-hgm",
  storageBucket: "tu-proyecto-hgm.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-XXXXXXXXXX"
};

// Verificación inicial de configuración
export const isFirebaseConfigured = () => {
    return firebaseConfig.apiKey && 
           !firebaseConfig.apiKey.includes("TU_API_KEY") && 
           firebaseConfig.projectId && 
           !firebaseConfig.projectId.includes("tu-proyecto");
};

let app = null;
let auth = null;
let db = null;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
} catch (error) {
    console.warn("Aviso Firebase:", error);
}

export {
    auth,
    db,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    query,
    where,
    serverTimestamp
};
