// src/services/authFirebase.ts
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

// 🔹 Criar novo usuário (Auth + Firestore)
// tipo: "cliente" ou "admin"
export const cadastrarUsuario = async (
  email: string,
  senha: string,
  nome: string,
  tipo: "cliente" | "admin" = "cliente"
): Promise<User> => {
  // Cria o usuário no Auth
  const credenciais = await createUserWithEmailAndPassword(auth, email, senha);
  const user = credenciais.user;

  // Cria o documento na coleção 'usuarios'
  await setDoc(doc(db, "usuarios", user.uid), {
    uid: user.uid,
    nome,
    email: user.email,
    tipo,                // define se é cliente ou admin
    dataCriacao: serverTimestamp(),
  });

  return user;
};

// 🔹 Fazer login
export const loginUsuario = async (
  email: string,
  senha: string
): Promise<User> => {
  const credenciais = await signInWithEmailAndPassword(auth, email, senha);
  return credenciais.user;
};

// 🔹 Fazer logout
export const sairUsuario = async (): Promise<void> => {
  await signOut(auth);
};

// 🔹 Deletar conta do usuário logado (Auth + Firestore)
export const deletarUsuario = async (): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Nenhum usuário logado.");

  // Remove o documento do Firestore
  await deleteDoc(doc(db, "usuarios", user.uid));

  // Remove a conta no Auth
  await deleteUser(user);
};

// 🔹 Observar mudanças de autenticação (logado/deslogado)
export const observarUsuario = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
