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

    // Nom du cadeau
    const tdLabel = document.createElement("td");
    tdLabel.textContent = item.label;

    // Personne
    const tdPersonne = document.createElement("td");
    tdPersonne.textContent = item.personne || "-";

    // Prix
    const tdPrix = document.createElement("td");
    tdPrix.textContent = item.prix ? item.prix + " €" : "-";

    // Lien
    const tdLien = document.createElement("td");
    if (item.lien) {
      const a = document.createElement("a");
      a.href = item.lien;
      a.target = "_blank";
      a.textContent = "Voir";
      a.style.color = "#007bff";
      tdLien.appendChild(a);
    } else {
      tdLien.textContent = "-";
    }

    // Bouton Réserver / Annuler
    const tdBtn = document.createElement("td");
    const btn = document.createElement("button");

    if (item.pris) {
      btn.textContent = "❌ Annuler";
      btn.className = "btn btn-annuler";
    } else {
      btn.textContent = "✔ Réserver";
      btn.className = "btn btn-reserver";
    }

    btn.addEventListener("click", () => {
      db.collection("Cadeaux").doc(doc.id).update({
        pris: !item.pris
      });
    });

    tdBtn.appendChild(btn);

    // -----------------------------
    // 🗑️ Bouton SUPPRIMER
    // -----------------------------
    const tdSupprimer = document.createElement("td");
    const btnDel = document.createElement("button");

    btnDel.textContent = "🗑️";
    btnDel.className = "btn btn-delete";

    btnDel.addEventListener("click", () => {
      if (confirm("Voulez-vous vraiment supprimer ce cadeau ?")) {
        db.collection("Cadeaux").doc(doc.id).delete();
      }
    });

    tdSupprimer.appendChild(btnDel);

    // Ligne complète
    tr.appendChild(tdLabel);
    tr.appendChild(tdPersonne);
    tr.appendChild(tdPrix);
    tr.appendChild(tdLien);
    tr.appendChild(tdBtn);
    tr.appendChild(tdSupprimer);

    liste.appendChild(tr);
  });
});


// -----------------------------
// ONGLET TABLEAU / CALENDRIER
// -----------------------------
document.getElementById("tabCadeaux").addEventListener("click", () => {
  document.getElementById("tableCadeaux").style.display = "table";
  document.getElementById("calendrier").style.display = "none";

  tabCadeaux.classList.add("active");
  tabCalendrier.classList.remove("active");
});

document.getElementById("tabCalendrier").addEventListener("click", () => {
  document.getElementById("tableCadeaux").style.display = "none";
  document.getElementById("calendrier").style.display = "block";

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

  // Débloquer seulement le 1er décembre avant l'heure
  const isUnlocked =
    (i === 1) ||
    (month === 12 && day >= i);

  if (!isUnlocked) div.classList.add("locked");

  div.textContent = i;

  div.addEventListener("click", () => {
    if (div.classList.contains("locked")) return;

    const popup = document.createElement("div");
    popup.className = "image-popup";
    popup.innerHTML = `<img src="images/${i}.jpg">`;

    popup.addEventListener("click", () => popup.remove());
    document.body.appendChild(popup);
  });

  grid.appendChild(div);
}


// -----------------------------
// FORMULAIRE D'AJOUT DE CADEAU
// -----------------------------
document.getElementById("btnAjouter").addEventListener("click", () => {
  const label = document.getElementById("inputLabel").value.trim();
  const personne = document.getElementById("inputPersonne").value.trim();
  const prix = parseFloat(document.getElementById("inputPrix").value.trim());
  const lien = document.getElementById("inputLien").value.trim();

  if (!label) {
    alert("Merci d'entrer un nom de cadeau.");
    return;
  }

  db.collection("Cadeaux").add({
    label: label,
    personne: personne || "",
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



