const API_URL = "https://script.google.com/macros/s/AKfycbx_--tgeQ8RivrBBqL284RItkMN8RgJoXcfU9__lIb8elXa3g8sO8yIRqW16Ieksf-w/exec";

// charger liste
async function load() {
  const res = await fetch(API_URL);
  const rows = await res.json();

  let html = "";
  rows.slice(1).forEach((r, i) => { // ignorer ligne titres
    html += `
      <div class="item">
        <div>
          <b>${r[0]}</b> — ${r[1]} <br>
          <a href="${r[2]}" target="_blank">Lien</a>
        </div>
        <img src="${r[3]}" />
        <button onclick="toggle(${i+2}, '${r[4] === '✔️' ? '❌':'✔️'}')">
          ${r[4]}
        </button>
        <button onclick="del(${i+2})">🗑️</button>
      </div>
    `;
  });

  document.getElementById("list").innerHTML = html;
}
load();

async function addGift() {
  const body = {
    action: "add",
    personne: personne.value,
    cadeau: cadeau.value,
    lien: lien.value,
    image: image.value
  };

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(body)
  });

  load();
}

async function toggle(row, value) {
  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action:"toggle", row, value })
  });
  load();
}

async function del(row) {
  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action:"delete", row })
  });
  load();
}
