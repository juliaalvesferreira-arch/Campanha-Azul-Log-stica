import { auth, db } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ================================
// Função de mensagem
// ================================
function showMessage(el, text, type = "error") {
  if (!el) return;
  el.textContent = text;
  el.className = `message ${type}`;
}

// ================================
// INIT
// ================================
document.addEventListener("DOMContentLoaded", () => {

  const loginForm = document.getElementById("loginForm");
  const cadastroForm = document.getElementById("cadastroForm");
  const msg = document.getElementById("msg");

  // ================================
  // CADASTRO
  // ================================
  if (cadastroForm) {
    cadastroForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim().toLowerCase();
      const senha = document.getElementById("senha").value;

      try {
        const cred = await createUserWithEmailAndPassword(auth, email, senha);

        await setDoc(doc(db, "usuarios", cred.user.uid), {
          email,
          aprovado: false,
          role: "usuario",
          criadoEm: serverTimestamp()
        });

        window.location.href = "./aguardando.html";

      } catch (error) {
        showMessage(msg, "Erro ao cadastrar: " + error.message);
      }
    });
  }

  // ================================
  // LOGIN
  // ================================
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim().toLowerCase();
      const senha = document.getElementById("senha").value;

      try {
        const cred = await signInWithEmailAndPassword(auth, email, senha);

        const snap = await getDoc(doc(db, "usuarios", cred.user.uid));

        if (!snap.exists()) {
          showMessage(msg, "Perfil não encontrado.");
          await signOut(auth);
          return;
        }

        const dados = snap.data();

        if (!dados.aprovado) {
          window.location.href = "./aguardando.html";
          return;
        }

        window.location.href = "./index.html";

      } catch (error) {
        showMessage(msg, "Erro no login: " + error.message);
      }
    });
  }

  // ================================
  // PROTEÇÃO DE PÁGINA
  // ================================
  if (document.body.dataset.proteger === "true") {
    document.body.style.display = "none";

    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "./login.html";
        return;
      }

      const snap = await getDoc(doc(db, "usuarios", user.uid));

      if (!snap.exists() || !snap.data().aprovado) {
        window.location.href = "./aguardando.html";
        return;
      }

      document.body.style.display = "block";
    });
  }

  // ================================
  // LOGOUT
  // ================================
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await signOut(auth);
      window.location.href = "./login.html";
    });
  }

});
