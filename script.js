const API = "https://thereafter-matthew-closure-grass.trycloudflare.com";

async function fetchPlayer() {
    let tag = document.getElementById("playerTag").value;
  
    if (!tag.startsWith("#")) tag = "#" + tag;
  
    const res = await fetch(`${API}/player/${tag}`);
    const data = await res.json();
  
    if (data.error) {
      alert("Jugador no encontrado");
      return;
    }
  
    // PLAYER
    document.getElementById("name").innerText = data.name;
    document.getElementById("tag").innerText = tag;
  
    // STATS
    document.getElementById("trophies").innerText = data.highest_trophies;
    document.getElementById("prestige").innerText = data.total_prestige;
    document.getElementById("wins").innerText = data.wins3v3;
  
    // BRAWLERS
    renderBrawlers(data.top_brawlers);
  }




  function renderBrawlers(brawlers) {
    const container = document.getElementById("brawlers");
    container.innerHTML = "";
  
    for (let b of brawlers) {
      const div = document.createElement("div");
      div.className = "brawler";
  
      div.innerHTML = `
        <strong>${b[0]}</strong>
        <p>🏆 ${b[5]}</p>
      `;
  
      container.appendChild(div);
    }
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