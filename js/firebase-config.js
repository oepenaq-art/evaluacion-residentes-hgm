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
 */
export const firebaseConfig = {
  apiKey: "AIzaSyDtxe_fELRPufWlvg06rxQAsg7uI0-eQiI",
  authDomain: "hgm-evaluacion-residentes.firebaseapp.com",
  projectId: "hgm-evaluacion-residentes",
  storageBucket: "hgm-evaluacion-residentes.firebasestorage.app",
  messagingSenderId: "89583168934",
  appId: "1:89583168934:web:e0f05819c84107558af367",
  measurementId: "G-F6RG5VCY93"
};

// Verificación de configuración activa
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
