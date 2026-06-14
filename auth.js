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

function showMessage(el, text, type = "error") {
  if (!el) return;
  el.textContent = text;
  el.className = `message ${type}`;
}

const loginForm = document.getElementById("loginForm");
const cadastroForm = document.getElementById("cadastroForm");
const msg = document.getElementById("msg");

if (cadastroForm) {
  cadastroForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const senha = document.getElementById("senha").value;

    if (!email.endsWith("@voeazul.com.br")) {
      showMessage(msg, "Apenas e-mails oficiais da Azul serão aprovados.");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, senha);

      await setDoc(doc(db, "usuarios", cred.user.uid), {
        email,
        aprovado: false,
        role: "usuario",
        dominioValido: true,
        criadoEm: serverTimestamp()
      });

      window.location.href = "./aguardando.html";
    } catch (error) {
      showMessage(msg, "Erro ao cadastrar: " + error.message);
    }
  });
}

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

window.protegerCampanha = function () {
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
};
