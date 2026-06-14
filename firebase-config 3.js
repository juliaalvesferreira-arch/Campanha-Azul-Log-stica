// firebase-config.js
// Configuração central do Firebase para a Campanha de Vendas
// Importado como módulo ES (type="module") nas páginas HTML

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuração do projeto "Campanha de Vendas" (Firebase Console > Configurações do projeto)
const firebaseConfig = {
  apiKey: "AIzaSyB5AYPQTA-fKQmA7uO27wMxoGplPjDtkDQ",
  authDomain: "campanha-de-vendas-a2527.firebaseapp.com",
  projectId: "campanha-de-vendas-a2527",
  storageBucket: "campanha-de-vendas-a2527.firebasestorage.app",
  messagingSenderId: "437832431713",
  appId: "1:437832431713:web:aa7c0ddc63b3f2b6221220",
  measurementId: "G-L7EBBH5ZZT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Domínios de e-mail corporativo aceitos para cadastro
const DOMINIOS_VALIDOS = ["voeazul.com.br", "azulcargo.com.br", "azullogistica.com.br"];

function dominioValido(email) {
  const partes = (email || "").toLowerCase().split("@");
  if (partes.length !== 2) return false;
  return DOMINIOS_VALIDOS.includes(partes[1]);
}

/**
 * Cria o documento do usuário em Firestore (coleção "usuarios")
 * com status pendente de aprovação.
 */
async function criarDocumentoUsuario(user) {
  const ref = doc(db, "usuarios", user.uid);
  await setDoc(ref, {
    email: user.email,
    role: "usuario",
    aprovado: false,
    dominioValido: dominioValido(user.email),
    criadoEm: serverTimestamp()
  });
}

/**
 * Busca o documento do usuário em Firestore.
 * Retorna null se não existir.
 */
async function buscarDocumentoUsuario(uid) {
  const ref = doc(db, "usuarios", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export {
  app,
  auth,
  db,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  dominioValido,
  criarDocumentoUsuario,
  buscarDocumentoUsuario
};
