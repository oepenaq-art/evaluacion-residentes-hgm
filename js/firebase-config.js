import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    sendPasswordResetEmail,
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    addDoc, 
    deleteDoc, 
    doc, 
    query, 
    where, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

/**
 * CONFIGURACIÓN DE FIREBASE PARA: HOSPITAL GENERAL DE MEDELLÍN (HGM)
 * 
 * INSTRUCCIONES:
 * 1. Ve a Firebase Console: https://console.firebase.google.com/
 * 2. En tu proyecto, añade una app Web (ícono </>) y copia el objeto firebaseConfig.
 * 3. Pega tus credenciales reales aquí abajo.
 */
export const firebaseConfig = {
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
    app,
    auth,
    db,
    initializeApp,
    getApp,
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    createUserWithEmailAndPassword,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    query,
    where,
    serverTimestamp
};
