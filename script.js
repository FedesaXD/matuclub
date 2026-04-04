const API = "https://matuclub-api.onrender.com";

// DEBUG TEMPORAL - borrar después
window.onerror = function(msg, src, line, col, err) {
  document.body.innerHTML += `<div style="position:fixed;bottom:0;left:0;right:0;background:red;color:white;padding:10px;font-size:12px;z-index:9999">ERROR: ${msg} | ${src}:${line}</div>`;
  return false;
};
window.addEventListener('unhandledrejection', e => {
  document.body.innerHTML += `<div style="position:fixed;bottom:0;left:0;right:0;background:red;color:white;padding:10px;font-size:12px;z-index:9999">PROMISE ERROR: ${e.reason}</div>`;
});

/* ─── BRAWLER & ASSET IMAGE MAPS ────────────────────── */
let BRAWLER_IMGS = {};
// Iconos del juego desde BrawlAPI
const GAME_ICONS = {
  trophy:     "https://cdn.brawlify.com/rank/Silver_III.png",
  prestige:   "https://cdn.brawlify.com/rank/Gold_I.png",
  wins3v3:    "https://cdn.brawlify.com/gamemode/gemGrab.png",
  winsSolo:   "https://cdn.brawlify.com/gamemode/soloShowdown.png",
  gadget:     null,  // se llena desde BrawlAPI
  starpower:  null,  // se llena desde BrawlAPI
  hypercharge:"https://cdn.brawlify.com/rank/Legendary_I.png",
  winstreak:  "https://cdn.brawlify.com/rank/Diamond_I.png",
};

async function loadBrawlerImages() {
  try {
    const res  = await fetch("https://api.brawlapi.com/v1/brawlers");
    const data = await res.json();
    if (data.list) {
      data.list.forEach(b => {
        BRAWLER_IMGS[b.name.toUpperCase()] = b.imageUrl2 || b.imageUrl;
      });
      // Tomar icono de gadget y starpower del primer brawler que los tenga
      const withGadget = data.list.find(b => b.gadgets && b.gadgets.length > 0);
      if (withGadget && withGadget.gadgets[0].imageUrl)
        GAME_ICONS.gadget = withGadget.gadgets[0].imageUrl;
      const withStar = data.list.find(b => b.starPowers && b.starPowers.length > 0);
      if (withStar && withStar.starPowers[0].imageUrl)
        GAME_ICONS.starpower = withStar.starPowers[0].imageUrl;
    }
  } catch(e) {
    console.warn("No se pudieron cargar imágenes de brawlers:", e);
  }
}

function getBrawlerImg(name) {
  return BRAWLER_IMGS[name] || null;
}

// Genera un <img> con fallback a texto
function gameIcon(key, label, fallbackEmoji) {
  const url = GAME_ICONS[key];
  if (!url) return `<span class="stat-icon-emoji">${fallbackEmoji}</span>`;
  return `<img src="${url}" class="stat-icon-img" alt="${label}"
               onerror="this.outerHTML='<span class=\'stat-icon-emoji\'>${fallbackEmoji}</span>'"/>`;
}

/* ─── UTILS ──────────────────────────────────────────── */
function showView(id) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function fmt(n) {
  return Number(n).toLocaleString("es-UY");
}

// Navega a la vista de jugador con un tag dado y dispara la búsqueda
function goToPlayer(tag) {
  showView("player");
  document.getElementById("playerTag").value = tag;
  fetchPlayer();
}

/* ─── TOP PRESTIGE ───────────────────────────────────── */
async function fetchPrestige() {
  const container = document.getElementById("prestigeList");
  container.innerHTML = `<div class="loading">Cargando ranking</div>`;
  try {
    const res  = await fetch(`${API}/top/prestige`);
    const data = await res.json();
    const rows = data.map(p => {
      const clickable = p.tag
        ? `onclick="goToPlayer('${p.tag}')" style="cursor:pointer"`
        : "";
      return `
        <tr ${clickable} class="clickable-row">
          <td>${p.rank}</td>
          <td>${p.name}</td>
          <td>${fmt(p.prestige)}</td>
        </tr>`;
    }).join("");
    container.innerHTML = `
      <div class="table-wrap">
        <p class="table-hint">Click en un jugador para ver su perfil</p>
        <table>
          <thead><tr><th>#</th><th>Jugador</th><th>Prestige</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  } catch {
    container.innerHTML = `<div class="loading">Error al cargar datos</div>`;
  }
}
document.getElementById("prestige").addEventListener("click", fetchPrestige);

/* ─── PLAYER ─────────────────────────────────────────── */
let chart;
let historyData = {};

async function fetchPlayer() {
  let tag = document.getElementById("playerTag").value.trim();
  if (!tag) return;
  if (!tag.startsWith("#")) tag = "#" + tag;

  const profileEl   = document.getElementById("playerProfile");
  const chartSec    = document.getElementById("chartSection");
  const brawlersSec = document.getElementById("brawlersSection");

  profileEl.innerHTML = `<div class="loading">Buscando jugador</div>`;
  chartSec.style.display    = "none";
  brawlersSec.style.display = "none";

  try {
    const res  = await fetch(`${API}/player/${encodeURIComponent(tag)}`);
    const data = await res.json();

    if (data.error) {
      profileEl.innerHTML = `<div class="loading">Jugador no encontrado</div>`;
      return;
    }

    // ── Profile card ──────────────────────────────────
    profileEl.innerHTML = `
      <div class="profile-card">
        <div class="profile-top">
          <div>
            <div class="profile-name">${data.name}</div>
            <div class="profile-club">${data.club_tag || "Sin club"}</div>
          </div>
          <div class="winstreak-badge">
            <div class="ws-label">Mejor racha</div>
            <div class="ws-val">${gameIcon('winstreak','racha','🔥')} ${data.best_winstreak.value}</div>
            <div class="ws-brawler">${data.best_winstreak.brawler}</div>
          </div>
        </div>
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-label">Trofeos máximos</div>
            <div class="stat-val">${gameIcon('trophy','trofeos','🏆')}${fmt(data.highest_trophies)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Prestige total</div>
            <div class="stat-val">${gameIcon('prestige','prestige','✨')}${fmt(data.total_prestige)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Victorias 3v3</div>
            <div class="stat-val">${gameIcon('wins3v3','3v3','🎮')}${fmt(data.wins3v3)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Victorias Solo</div>
            <div class="stat-val">${gameIcon('winsSolo','solo','⚔️')}${fmt(data.winsSolo)}</div>
          </div>
        </div>
      </div>`;

    // ── History chart ──────────────────────────────────
    if (data.history && data.history.length > 1) {
      historyData = {
        labels:     data.history.map(h => {
          const d = new Date(h[0]);
          return `${d.getDate()}/${d.getMonth()+1} ${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;
        }),
        trophies:   data.history.map(h => h[1]),
        wins3v3:    data.history.map(h => h[2]),
        winsSolo:   data.history.map(h => h[3]),
        prestigeLvl: data.history.map(h => h[4]),
      };
      chartSec.style.display = "block";
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      document.querySelector(".tab").classList.add("active");
      renderChart("trophies");
    }

    // ── Brawler grid ───────────────────────────────────
    if (data.top_brawlers && data.top_brawlers.length > 0) {
      brawlersSec.style.display = "block";
      const grid = document.getElementById("brawlerGrid");
      grid.innerHTML = data.top_brawlers.map(b => {
        const [bName, power, gadgets, stars, hyper, trophies] = b;
        const displayName = bName.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        const imgUrl = getBrawlerImg(bName);

        const imgTag = imgUrl
          ? `<img src="${imgUrl}" alt="${displayName}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />`
          : "";
        const placeholderStyle = imgUrl ? "display:none" : "display:flex";

        const gadgetPills = gadgets > 0 ? `<span class="attr-pill attr-gadget">${gameIcon('gadget','gadget','⚙️')} ${gadgets}</span>` : "";
        const starPills   = stars > 0   ? `<span class="attr-pill attr-star">${gameIcon('starpower','star power','⭐')} ${stars}</span>`    : "";
        const hyperPills  = hyper > 0   ? `<span class="attr-pill attr-hyper">${gameIcon('hypercharge','hypercharge','⚡')} HC</span>`          : "";

        return `
          <div class="brawler-card">
            <div class="brawler-img-wrap">
              ${imgTag}
              <div class="brawler-img-placeholder" style="${placeholderStyle}">${displayName}</div>
              <div class="brawler-power">P${power}</div>
              <div class="brawler-trophies">${gameIcon('trophy','trofeos','🏆')} ${fmt(trophies)}</div>
            </div>
            <div class="brawler-info">
              <div class="brawler-name">${displayName}</div>
              <div class="brawler-attrs">${gadgetPills}${starPills}${hyperPills}</div>
            </div>
          </div>`;
      }).join("");
    }

  } catch(e) {
    profileEl.innerHTML = `<div class="loading">Error al cargar jugador</div>`;
    console.error(e);
  }
}

/* ─── CHART ──────────────────────────────────────────── */
const CHART_CONFIG = {
  trophies:    { label: "Copas",         color: "#00d4ff" },
  wins3v3:     { label: "Victorias 3v3", color: "#0099ff" },
  winsSolo:    { label: "Victorias Solo", color: "#6655ff" },
  prestigeLvl: { label: "Prestige",      color: "#00e899" },
};

function renderChart(key) {
  const { label, color } = CHART_CONFIG[key];
  if (chart) chart.destroy();
  Chart.defaults.color = "#4a6a85";
  Chart.defaults.font.family = "'DM Sans', sans-serif";
  chart = new Chart(document.getElementById("chart"), {
    type: "line",
    data: {
      labels: historyData.labels,
      datasets: [{
        label,
        data: historyData[key],
        borderColor: color,
        backgroundColor: hexAlpha(color, 0.08),
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: color,
        pointBorderColor: "transparent",
        tension: 0.4,
        fill: true,
      }]
    },
    options: {
      responsive: true,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#07111f",
          borderColor: "rgba(0,160,255,0.2)",
          borderWidth: 1,
          titleColor: "#ddeeff",
          bodyColor: "#4a6a85",
          padding: 12,
          callbacks: { label: ctx => `${label}: ${fmt(ctx.parsed.y)}` }
        }
      },
      scales: {
        x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#4a6a85", maxTicksLimit: 8, maxRotation: 0 } },
        y: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#4a6a85", callback: v => fmt(v) } }
      }
    }
  });
}

function switchTab(key, el) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  el.classList.add("active");
  renderChart(key);
}

function hexAlpha(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ─── TOP BRAWLER ────────────────────────────────────── */
async function fetchBrawler() {
  const name      = document.getElementById("brawlerName").value.trim();
  const container = document.getElementById("brawlerList");
  if (!name) return;

  container.innerHTML = `<div class="loading">Buscando brawler</div>`;
  try {
    const res  = await fetch(`${API}/top/brawler/${encodeURIComponent(name)}`);
    const data = await res.json();

    if (data.error) {
      container.innerHTML = `<div class="loading">No hay datos para este brawler</div>`;
      return;
    }

    const rows = data.map(p => {
      const clickable = p.tag
        ? `onclick="goToPlayer('${p.tag}')" style="cursor:pointer"`
        : "";
      return `
        <tr ${clickable} class="clickable-row">
          <td>${p.rank}</td>
          <td>${p.name}</td>
          <td>${fmt(p.trophies)}</td>
        </tr>`;
    }).join("");

    container.innerHTML = `
      <div class="table-wrap">
        <p class="table-hint">Click en un jugador para ver su perfil</p>
        <table>
          <thead><tr><th>#</th><th>Jugador</th><th>Trofeos</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  } catch {
    container.innerHTML = `<div class="loading">Error al cargar datos</div>`;
  }
}

/* ─── KEYBOARD ───────────────────────────────────────── */
document.getElementById("playerTag").addEventListener("keydown", e => {
  if (e.key === "Enter") fetchPlayer();
});
document.getElementById("brawlerName").addEventListener("keydown", e => {
  if (e.key === "Enter") fetchBrawler();
});

/* ─── INIT ───────────────────────────────────────────── */
loadBrawlerImages();
