const API = "https://thereafter-matthew-closure-grass.trycloudflare.com";

async function fetchPlayer() {
    const tag = document.getElementById("playerTag").value;
    const res = await fetch(`${API}/player/${tag}`);
    const data = await res.json();
  
    const div = document.getElementById("playerInfo");
  
    if (data.error) {
      div.innerHTML = "<p>Jugador no encontrado</p>";
      return;
    }
  
    div.innerHTML = `
      <div class="card">
        <h2>${data.name}</h2>
        <p>🏆 Máx: ${data.highest_trophies}</p>
        <p>🎮 3v3: ${data.wins3v3}</p>
        <p>✨ Prestige: ${data.total_prestige}</p>
        <p>🔥 Best WS: ${data.best_winstreak.value}</p>
      </div>
    `;
  
    renderBrawlers(data.top_brawlers);
  }

  function renderBrawlers(brawlers) {
    let html = "<h3>Top Brawlers</h3><table>";
    html += "<tr><th>Name</th><th>Trophies</th></tr>";
  
    for (let b of brawlers) {
      html += `<tr><td>${b[0]}</td><td>${b[5]}</td></tr>`;
    }
  
    html += "</table>";
  
    document.getElementById("playerInfo").innerHTML += html;
  }

  async function fetchTopPrestige() {
    const res = await fetch(`${API}/top/prestige`);
    const data = await res.json();
  
    let html = "<table>";
    html += "<tr><th>#</th><th>Name</th><th>Prestige</th></tr>";
  
    for (let p of data) {
      html += `<tr>
        <td>${p.rank}</td>
        <td>${p.name}</td>
        <td>${p.prestige}</td>
      </tr>`;
    }
  
    html += "</table>";
  
    document.getElementById("topPrestige").innerHTML = html;
  }