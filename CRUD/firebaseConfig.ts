// Importa o SDK principal
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Suas configurações do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBELVrUi-ijEPPRPX7brAf6Fyndt1CK51o",
  authDomain: "app-agenda-2028e.firebaseapp.com",
  projectId: "app-agenda-2028e",
  storageBucket: "app-agenda-2028e.firebasestorage.app",
  messagingSenderId: "593829969583",
  appId: "1:593829969583:web:e0dfadec8ed569d0141e5a",
};

// Inicializa o app Firebase
const app = initializeApp(firebaseConfig);

// Inicializa os serviços que você vai usar
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
