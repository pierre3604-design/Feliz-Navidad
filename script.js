// -----------------------------
// Config Firebase
// -----------------------------
const firebaseConfig = {
  apiKey: "AIzaSyBYno0DBHcj8E04rOdwlKAr-xpsMrqSb_U",
  authDomain: "navidad-daa8a.firebaseapp.com",
  projectId: "navidad-daa8a",
  storageBucket: "navidad-daa8a.firebasestorage.app",
  messagingSenderId: "659203652652",
  appId: "1:659203652652:web:63c8d38f19d7459c242589",
  measurementId: "G-097V2FEBBT"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const liste = document.getElementById("liste");

// -----------------------------
// LECTURE TEMPS RÉEL FIRESTORE
// -----------------------------
db.collection("Cadeaux").onSnapshot(snapshot => {
  liste.innerHTML = "";

  snapshot.forEach(doc => {
    const item = doc.data();

    const tr = document.createElement("tr");
    if (item.pris) tr.classList.add("pris");

    const tdLabel = document.createElement("td");
    tdLabel.textContent = item.label;

    const tdPersonne = document.createElement("td");
    tdPersonne.textContent = item.personne || "-";

    const tdPrix = document.createElement("td");
    tdPrix.textContent = item.prix ? item.prix + " €" : "-";

    const tdLien = document.createElement("td");

    if (item.lien) {
      const a = document.createElement("a");
      a.href = item.lien;
      a.target = "_blank";
      a.textContent = "Voir";
      a.style.color = "#007bff";

      tdLien.appendChild(a);

      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️";
      editBtn.className = "btn btn-edit";
      editBtn.style.marginLeft = "8px";

      editBtn.addEventListener("click", () => {
        const newLink = prompt("Nouveau lien :", item.lien);
        if (newLink !== null) {
          db.collection("Cadeaux").doc(doc.id).update({ lien: newLink.trim() });
        }
      });

      tdLien.appendChild(editBtn);
    } else {
      tdLien.textContent = "-";
    }

    const tdBtn = document.createElement("td");
    const btn = document.createElement("button");
    btn.textContent = item.pris ? "❌ Annuler" : "✔ Réserver";
    btn.className = item.pris ? "btn btn-annuler" : "btn btn-reserver";

    btn.addEventListener("click", () => {
      db.collection("Cadeaux").doc(doc.id).update({ pris: !item.pris });
    });

    tdBtn.appendChild(btn);

    const tdSup = document.createElement("td");
    const del = document.createElement("button");
    del.textContent = "🗑️";
    del.className = "btn btn-delete";

    del.addEventListener("click", () => {
      if (confirm("Supprimer ce cadeau ?")) {
        db.collection("Cadeaux").doc(doc.id).delete();
      }
    });

    tdSup.appendChild(del);

    tr.appendChild(tdLabel);
    tr.appendChild(tdPersonne);
    tr.appendChild(tdPrix);
    tr.appendChild(tdLien);
    tr.appendChild(tdBtn);
    tr.appendChild(tdSup);

    liste.appendChild(tr);
  });
});


// -----------------------------
// ONGLET CADEAUX / CALENDRIER
// -----------------------------
const tabCadeaux = document.getElementById("tabCadeaux");
const tabCalendrier = document.getElementById("tabCalendrier");

const ongletCadeaux = document.getElementById("ongletCadeaux");
const ongletCalendrier = document.getElementById("ongletCalendrier");

tabCadeaux.addEventListener("click", () => {
  ongletCadeaux.style.display = "block";
  ongletCalendrier.style.display = "none";

  tabCadeaux.classList.add("active");
  tabCalendrier.classList.remove("active");
});

tabCalendrier.addEventListener("click", () => {
  ongletCadeaux.style.display = "none";
  ongletCalendrier.style.display = "block";

  tabCalendrier.classList.add("active");
  tabCadeaux.classList.remove("active");
});


// -----------------------------
// CALENDRIER DE L’AVENT
// -----------------------------
const today = new Date();
const day = today.getDate();
const month = today.getMonth() + 1;

const grid = document.getElementById("grid-calendrier");

for (let i = 1; i <= 24; i++) {
  const div = document.createElement("div");
  div.className = "case-jour";

  const isUnlocked = (i === 1) || (month === 12 && day >= i);

  if (!isUnlocked) div.classList.add("locked");

  div.textContent = i;

  div.addEventListener("click", () => {
    if (div.classList.contains("locked")) {
      alert("Petit malin 😏 Ce n'est pas encore la date !");
      return;
    }

    openPopup(`images/${i}.jpeg`);
  });

  grid.appendChild(div);
}


// -----------------------------
// POPUP IMAGE (NOUVELLE VERSION)
// -----------------------------
function openPopup(imageUrl) {
  const overlay = document.getElementById("popupOverlay");
  const img = document.getElementById("popupImg");

  img.src = imageUrl;
  overlay.style.display = "flex";
}

function closePopup() {
  document.getElementById("popupOverlay").style.display = "none";
}

document.getElementById("closePopup").addEventListener("click", closePopup);

document.getElementById("popupOverlay").addEventListener("click", (e) => {
  if (e.target.id === "popupOverlay") closePopup();
});


// -----------------------------
// FORMULAIRE AJOUT CADEAU
// -----------------------------
document.getElementById("btnAjouter").addEventListener("click", () => {
  const label = document.getElementById("inputLabel").value.trim();
  const personne = document.getElementById("inputPersonne").value.trim();
  const prix = parseFloat(document.getElementById("inputPrix").value.trim());
  const lien = document.getElementById("inputLien").value.trim();

  if (!label) return alert("Merci d'entrer un nom de cadeau.");

  db.collection("Cadeaux").add({
    label: label,
    personne: personne,
    prix: prix || null,
    lien: lien || null,
    pris: false
  }).then(() => {
    document.getElementById("inputLabel").value = "";
    document.getElementById("inputPersonne").value = "";
    document.getElementById("inputPrix").value = "";
    document.getElementById("inputLien").value = "";
    alert("🎁 Cadeau ajouté !");
  });
});


// -----------------------------
// COUNTDOWN JUSQU'À NOËL
// -----------------------------
function updateCountdown() {
  const now = new Date();
  const christmas = new Date("2025-12-25T00:00:00");
  const diff = christmas - now;

  if (diff <= 0) {
    document.getElementById("countdown").textContent = "🎁 Joyeux Noël !";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  document.getElementById("countdown").textContent =
    `⏳ Noël dans ${days} jours, ${hours}h ${minutes}min 🎅`;
}

updateCountdown();
setInterval(updateCountdown, 60000);


// -----------------------------
// MUSIQUE + BOUTON MUET
// -----------------------------
const music = document.getElementById("noelMusic");
const muteBtn = document.getElementById("muteBtn");

muteBtn.addEventListener("click", () => {
  music.muted = !music.muted;
  muteBtn.textContent = music.muted ? "🔇 Muet" : "🔊 Musique";
});


// -----------------------------
// FLOCONS DE NEIGE
// -----------------------------
function makeSnow() {
  const flake = document.createElement("div");
  flake.classList.add("snowflake");
  flake.textContent = "❄";

  flake.style.left = Math.random() * 100 + "vw";
  flake.style.animationDuration = (3 + Math.random() * 5) + "s";

  document.body.appendChild(flake);
  setTimeout(() => flake.remove(), 8000);
}

setInterval(makeSnow, 150);
