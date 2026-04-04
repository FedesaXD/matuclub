const API = "https://matuclub-api.onrender.com";

/* ─── BRAWLER & ASSET IMAGE MAPS ────────────────────── */
var BRAWLER_IMGS = {};
var GAME_ICONS = {
  trophy:      "https://cdn.brawlify.com/rank/Silver_III.png",
  prestige:    "https://cdn.brawlify.com/rank/Gold_I.png",
  wins3v3:     "https://cdn.brawlify.com/gamemode/gemGrab.png",
  winsSolo:    "https://cdn.brawlify.com/gamemode/soloShowdown.png",
  gadget:      null,
  starpower:   null,
  hypercharge: "https://cdn.brawlify.com/rank/Legendary_I.png",
  winstreak:   "https://cdn.brawlify.com/rank/Diamond_I.png"
};

function loadBrawlerImages() {
  fetch("https://api.brawlapi.com/v1/brawlers")
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (!data.list) return;
      data.list.forEach(function(b) {
        BRAWLER_IMGS[b.name.toUpperCase()] = b.imageUrl2 || b.imageUrl;
      });
      var withGadget = data.list.filter(function(b) { return b.gadgets && b.gadgets.length > 0; })[0];
      if (withGadget && withGadget.gadgets[0].imageUrl)
        GAME_ICONS.gadget = withGadget.gadgets[0].imageUrl;
      var withStar = data.list.filter(function(b) { return b.starPowers && b.starPowers.length > 0; })[0];
      if (withStar && withStar.starPowers[0].imageUrl)
        GAME_ICONS.starpower = withStar.starPowers[0].imageUrl;
    })
    .catch(function(e) { console.warn("No se pudieron cargar imágenes:", e); });
}

function getBrawlerImg(name) {
  return BRAWLER_IMGS[name] || null;
}

// Genera icono del juego — sin onerror inline, usa un elemento real
function gameIcon(key, alt, fallback) {
  var url = GAME_ICONS[key];
  if (!url) return '<span class="stat-icon-emoji">' + fallback + '</span>';
  return '<img src="' + url + '" class="stat-icon-img" alt="' + alt + '">';
}

/* ─── UTILS ──────────────────────────────────────────── */
function showView(id) {
  var views = document.querySelectorAll(".view");
  for (var i = 0; i < views.length; i++) views[i].classList.remove("active");
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}

function fmt(n) {
  return Number(n).toLocaleString("es-UY");
}

function goToPlayer(tag) {
  showView("player");
  document.getElementById("playerTag").value = tag;
  fetchPlayer();
}

/* ─── EVENT DELEGATION para filas clickeables ────────── */
// En vez de onclick inline, usamos data-tag y delegación de eventos
document.addEventListener("click", function(e) {
  var row = e.target.closest("tr[data-tag]");
  if (row) {
    var tag = row.getAttribute("data-tag");
    if (tag) goToPlayer(tag);
  }
});

/* ─── TOP PRESTIGE ───────────────────────────────────── */
function fetchPrestige() {
  var container = document.getElementById("prestigeList");
  container.innerHTML = '<div class="loading">Cargando ranking</div>';
  fetch(API + "/top/prestige")
    .then(function(res) { return res.json(); })
    .then(function(data) {
      var rows = data.map(function(p) {
        var dataTag = p.tag ? ' data-tag="' + p.tag + '"' : "";
        var cursor  = p.tag ? ' style="cursor:pointer"' : "";
        return '<tr class="clickable-row"' + dataTag + cursor + '>'
          + '<td>' + p.rank + '</td>'
          + '<td>' + p.name + '</td>'
          + '<td>' + fmt(p.prestige) + '</td>'
          + '</tr>';
      }).join("");
      container.innerHTML = '<div class="table-wrap">'
        + '<p class="table-hint">Toca un jugador para ver su perfil</p>'
        + '<table><thead><tr><th>#</th><th>Jugador</th><th>Prestige</th></tr></thead>'
        + '<tbody>' + rows + '</tbody></table></div>';
    })
    .catch(function() {
      container.innerHTML = '<div class="loading">Error al cargar datos</div>';
    });
}
document.getElementById("prestige").addEventListener("click", fetchPrestige);

/* ─── PLAYER ─────────────────────────────────────────── */
var chart;
var historyData = {};

function fetchPlayer() {
  var tag = document.getElementById("playerTag").value.trim();
  if (!tag) return;
  if (tag.charAt(0) !== "#") tag = "#" + tag;

  var profileEl   = document.getElementById("playerProfile");
  var chartSec    = document.getElementById("chartSection");
  var brawlersSec = document.getElementById("brawlersSection");

  profileEl.innerHTML = '<div class="loading">Buscando jugador</div>';
  chartSec.style.display    = "none";
  brawlersSec.style.display = "none";

  fetch(API + "/player/" + encodeURIComponent(tag))
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.error) {
        profileEl.innerHTML = '<div class="loading">Jugador no encontrado</div>';
        return;
      }

      // ── Profile card ────────────────────────────────
      profileEl.innerHTML =
        '<div class="profile-card">'
        + '<div class="profile-top">'
        +   '<div>'
        +     '<div class="profile-name">' + data.name + '</div>'
        +     '<div class="profile-club">' + (data.club_tag || "Sin club") + '</div>'
        +   '</div>'
        +   '<div class="winstreak-badge">'
        +     '<div class="ws-label">Mejor racha</div>'
        +     '<div class="ws-val">' + gameIcon("winstreak","racha","🔥") + ' ' + data.best_winstreak.value + '</div>'
        +     '<div class="ws-brawler">' + data.best_winstreak.brawler + '</div>'
        +   '</div>'
        + '</div>'
        + '<div class="stats-grid">'
        +   '<div class="stat-box"><div class="stat-label">Trofeos máximos</div>'
        +     '<div class="stat-val">' + gameIcon("trophy","trofeos","🏆") + fmt(data.highest_trophies) + '</div></div>'
        +   '<div class="stat-box"><div class="stat-label">Prestige total</div>'
        +     '<div class="stat-val">' + gameIcon("prestige","prestige","✨") + fmt(data.total_prestige) + '</div></div>'
        +   '<div class="stat-box"><div class="stat-label">Victorias 3v3</div>'
        +     '<div class="stat-val">' + gameIcon("wins3v3","3v3","🎮") + fmt(data.wins3v3) + '</div></div>'
        +   '<div class="stat-box"><div class="stat-label">Victorias Solo</div>'
        +     '<div class="stat-val">' + gameIcon("winsSolo","solo","⚔️") + fmt(data.winsSolo) + '</div></div>'
        + '</div></div>';

      // ── History chart ────────────────────────────────
      if (data.history && data.history.length > 1) {
        historyData = {
          labels:      data.history.map(function(h) {
            var d = new Date(h[0]);
            var mm = String(d.getMinutes()).length < 2 ? "0" + d.getMinutes() : String(d.getMinutes());
            return d.getDate() + "/" + (d.getMonth()+1) + " " + d.getHours() + ":" + mm;
          }),
          trophies:    data.history.map(function(h) { return h[1]; }),
          wins3v3:     data.history.map(function(h) { return h[2]; }),
          winsSolo:    data.history.map(function(h) { return h[3]; }),
          prestigeLvl: data.history.map(function(h) { return h[4]; })
        };
        chartSec.style.display = "block";
        var tabs = document.querySelectorAll(".tab");
        for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove("active");
        document.querySelector(".tab").classList.add("active");
        renderChart("trophies");
      }

      // ── Brawler grid ─────────────────────────────────
      if (data.top_brawlers && data.top_brawlers.length > 0) {
        brawlersSec.style.display = "block";
        var grid = document.getElementById("brawlerGrid");
        grid.innerHTML = data.top_brawlers.map(function(b) {
          var bName       = b[0];
          var power       = b[1];
          var gadgets     = b[2];
          var stars       = b[3];
          var hyper       = b[4];
          var trophies    = b[5];
          var displayName = bName.toLowerCase().replace(/\b\w/g, function(c) { return c.toUpperCase(); });
          var imgUrl      = getBrawlerImg(bName);

          var imgHtml = imgUrl
            ? '<img src="' + imgUrl + '" alt="' + displayName + '" class="brawler-main-img">'
            : "";
          var placeholderDisplay = imgUrl ? "none" : "flex";

          var gadgetPill = gadgets > 0
            ? '<span class="attr-pill attr-gadget">' + gameIcon("gadget","gadget","⚙️") + " " + gadgets + '</span>'
            : "";
          var starPill = stars > 0
            ? '<span class="attr-pill attr-star">' + gameIcon("starpower","star power","⭐") + " " + stars + '</span>'
            : "";
          var hyperPill = hyper > 0
            ? '<span class="attr-pill attr-hyper">' + gameIcon("hypercharge","hypercharge","⚡") + " HC</span>"
            : "";

          return '<div class="brawler-card">'
            + '<div class="brawler-img-wrap">'
            +   imgHtml
            +   '<div class="brawler-img-placeholder" style="display:' + placeholderDisplay + '">' + displayName + '</div>'
            +   '<div class="brawler-power">P' + power + '</div>'
            +   '<div class="brawler-trophies">' + gameIcon("trophy","trofeos","🏆") + ' ' + fmt(trophies) + '</div>'
            + '</div>'
            + '<div class="brawler-info">'
            +   '<div class="brawler-name">' + displayName + '</div>'
            +   '<div class="brawler-attrs">' + gadgetPill + starPill + hyperPill + '</div>'
            + '</div></div>';
        }).join("");
      }
    })
    .catch(function(e) {
      profileEl.innerHTML = '<div class="loading">Error al cargar jugador</div>';
      console.error(e);
    });
}

/* ─── CHART ──────────────────────────────────────────── */
var CHART_CONFIG = {
  trophies:    { label: "Copas",          color: "#00d4ff" },
  wins3v3:     { label: "Victorias 3v3",  color: "#0099ff" },
  winsSolo:    { label: "Victorias Solo", color: "#6655ff" },
  prestigeLvl: { label: "Prestige",       color: "#00e899" }
};

function renderChart(key) {
  var cfg   = CHART_CONFIG[key];
  var label = cfg.label;
  var color = cfg.color;
  if (chart) chart.destroy();
  Chart.defaults.color = "#4a6a85";
  Chart.defaults.font.family = "'DM Sans', sans-serif";
  chart = new Chart(document.getElementById("chart"), {
    type: "line",
    data: {
      labels: historyData.labels,
      datasets: [{
        label: label,
        data: historyData[key],
        borderColor: color,
        backgroundColor: hexAlpha(color, 0.08),
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: color,
        pointBorderColor: "transparent",
        tension: 0.4,
        fill: true
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
          callbacks: { label: function(ctx) { return label + ": " + fmt(ctx.parsed.y); } }
        }
      },
      scales: {
        x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#4a6a85", maxTicksLimit: 8, maxRotation: 0 } },
        y: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#4a6a85", callback: function(v) { return fmt(v); } } }
      }
    }
  });
}

function switchTab(key, el) {
  var tabs = document.querySelectorAll(".tab");
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove("active");
  el.classList.add("active");
  renderChart(key);
}

function hexAlpha(hex, alpha) {
  var r = parseInt(hex.slice(1,3), 16);
  var g = parseInt(hex.slice(3,5), 16);
  var b = parseInt(hex.slice(5,7), 16);
  return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
}

/* ─── TOP BRAWLER ────────────────────────────────────── */
function fetchBrawler() {
  var name      = document.getElementById("brawlerName").value.trim();
  var container = document.getElementById("brawlerList");
  if (!name) return;

  container.innerHTML = '<div class="loading">Buscando brawler</div>';
  fetch(API + "/top/brawler/" + encodeURIComponent(name))
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.error) {
        container.innerHTML = '<div class="loading">No hay datos para este brawler</div>';
        return;
      }
      var rows = data.map(function(p) {
        var dataTag = p.tag ? ' data-tag="' + p.tag + '"' : "";
        var cursor  = p.tag ? ' style="cursor:pointer"' : "";
        return '<tr class="clickable-row"' + dataTag + cursor + '>'
          + '<td>' + p.rank + '</td>'
          + '<td>' + p.name + '</td>'
          + '<td>' + fmt(p.trophies) + '</td>'
          + '</tr>';
      }).join("");
      container.innerHTML = '<div class="table-wrap">'
        + '<p class="table-hint">Toca un jugador para ver su perfil</p>'
        + '<table><thead><tr><th>#</th><th>Jugador</th><th>Trofeos</th></tr></thead>'
        + '<tbody>' + rows + '</tbody></table></div>';
    })
    .catch(function() {
      container.innerHTML = '<div class="loading">Error al cargar datos</div>';
    });
}

/* ─── KEYBOARD ───────────────────────────────────────── */
document.getElementById("playerTag").addEventListener("keydown", function(e) {
  if (e.key === "Enter") fetchPlayer();
});
document.getElementById("brawlerName").addEventListener("keydown", function(e) {
  if (e.key === "Enter") fetchBrawler();
});

/* ─── INIT ───────────────────────────────────────────── */
loadBrawlerImages();
