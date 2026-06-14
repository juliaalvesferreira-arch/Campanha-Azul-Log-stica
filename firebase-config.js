import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

export const auth = getAuth(app);
export const db = getFirestore(app);
