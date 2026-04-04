const API = "https://matuclub-api.onrender.com";

/* ─── BRAWLER IMAGE MAP ──────────────────────────────── */
var BRAWLER_IMGS   = {};
var BRAWLER_LIST   = []; // para autocompletado (punto 5)

function loadBrawlerImages() {
  fetch("https://api.brawlapi.com/v1/brawlers")
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (!data.list) return;
      data.list.forEach(function(b) {
        var key = b.name.toUpperCase();
        BRAWLER_IMGS[key] = b.imageUrl2 || b.imageUrl;
        BRAWLER_LIST.push({ name: b.name, img: b.imageUrl2 || b.imageUrl });
      });
      BRAWLER_LIST.sort(function(a,b){ return a.name.localeCompare(b.name); });
    })
    .catch(function(e) { console.warn("No se pudieron cargar imágenes de brawlers:", e); });
}

function getBrawlerImg(name) {
  return BRAWLER_IMGS[name.toUpperCase()] || null;
}

/* ─── PLAYER ICON ─────────────────────────────────────── */
function getPlayerIconUrl(iconId) {
  if (!iconId) return null;
  return "https://cdn.brawlify.com/profile/" + iconId + ".png";
}

/* ─── ICONOS SVG INLINE ──────────────────────────────── */
var ICONS = {
  trophy:      '<svg class="stat-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 3h12v7a6 6 0 01-12 0V3z" fill="#ffd700" stroke="#e6b800" stroke-width="1"/><path d="M3 5h3v4a3 3 0 01-3-3V5zM21 5h-3v4a3 3 0 003-3V5z" fill="#ffd700" stroke="#e6b800" stroke-width="1"/><rect x="9" y="16" width="6" height="2" rx="1" fill="#ffd700"/><rect x="7" y="18" width="10" height="2" rx="1" fill="#e6b800"/></svg>',
  prestige:    '<svg class="stat-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" fill="#00d4ff" stroke="#0099cc" stroke-width="1"/></svg>',
  wins3v3:     '<svg class="stat-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="3" fill="#00aaff"/><circle cx="16" cy="8" r="3" fill="#00aaff"/><circle cx="12" cy="6" r="3" fill="#0066ff"/><path d="M2 20c0-4 3-6 6-6h8c3 0 6 2 6 6" stroke="#00aaff" stroke-width="2" fill="none"/></svg>',
  winsSolo:    '<svg class="stat-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="7" r="4" fill="#aa55ff"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#aa55ff" stroke-width="2" fill="none"/></svg>',
  winstreak:   '<svg class="stat-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2c0 0 4 5 4 10a4 4 0 01-8 0c0-2 1-4 1-4s-3 2-3 6a7 7 0 0014 0c0-7-8-12-8-12z" fill="#ff6600" stroke="#cc4400" stroke-width="0.5"/><path d="M12 10c0 0 2 2 2 4a2 2 0 01-4 0c0-1 0.5-2 0.5-2s-1 1-1 3a2.5 2.5 0 005 0c0-3-2.5-5-2.5-5z" fill="#ffcc00"/></svg>',
  gadget:      '<svg class="stat-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="3" width="8" height="14" rx="2" fill="#8855ff" stroke="#6633cc" stroke-width="1"/><rect x="10" y="17" width="4" height="4" rx="1" fill="#6633cc"/><circle cx="12" cy="10" r="2" fill="#ccaaff"/></svg>',
  starpower:   '<svg class="stat-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="12,3 14,9 20,9 15.5,13 17,19 12,16 7,19 8.5,13 4,9 10,9" fill="#ffcc00" stroke="#ff9900" stroke-width="1"/></svg>',
  hypercharge: '<svg class="stat-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="13,2 13,10 20,10 11,22 11,14 4,14" fill="#00ff99" stroke="#00cc77" stroke-width="1"/></svg>'
};

function icon(key) { return ICONS[key] || ""; }

/* ─── UTILS ──────────────────────────────────────────── */
function showView(id) {
  var views = document.querySelectorAll(".view");
  for (var i = 0; i < views.length; i++) views[i].classList.remove("active");
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}

function fmt(n) { return Number(n).toLocaleString("es-UY"); }

function goToPlayer(tag) {
  showView("player");
  document.getElementById("playerTag").value = tag;
  fetchPlayer();
}

/* ─── EVENT DELEGATION para filas clickeables ────────── */
document.addEventListener("click", function(e) {
  var row = e.target.closest("tr[data-tag]");
  if (row) {
    var tag = row.getAttribute("data-tag");
    if (tag) goToPlayer(tag);
  }
});

/* ─── TOP PRESTIGE ───────────────────────────────────── */
// PUNTO 3: Caché con TTL de 5 minutos
var prestigeCache = { data: null, ts: 0 };
var PRESTIGE_TTL  = 5 * 60 * 1000;

function fetchPrestige() {
  var now = Date.now();
  if (prestigeCache.data && (now - prestigeCache.ts) < PRESTIGE_TTL) {
    renderPrestige(prestigeCache.data);
    return;
  }

  var container = document.getElementById("prestigeList");
  container.innerHTML = renderSkeleton(8, "prestige");

  fetch(API + "/top/prestige")
    .then(function(res) { return res.json(); })
    .then(function(data) {
      prestigeCache = { data: data, ts: Date.now() };
      renderPrestige(data);
    })
    .catch(function() {
      container.innerHTML = '<div class="loading">Error al cargar datos</div>';
    });
}

function renderPrestige(data) {
  var container = document.getElementById("prestigeList");
  var rows = data.map(function(p) {
    var dataTag = p.tag ? ' data-tag="' + p.tag + '"' : "";
    var cursor  = p.tag ? ' style="cursor:pointer"' : "";
    return '<tr class="clickable-row"' + dataTag + cursor + '>'
      + '<td>' + p.rank + '</td>'
      + '<td>' + p.name + '</td>'
      + '<td>' + icon("trophy") + fmt(p.prestige) + '</td>'
      + '</tr>';
  }).join("");
  container.innerHTML = '<div class="table-wrap">'
    + '<p class="table-hint">Toca un jugador para ver su perfil</p>'
    + '<table><thead><tr><th>#</th><th>Jugador</th><th>Prestige</th></tr></thead>'
    + '<tbody>' + rows + '</tbody></table></div>';
}

document.querySelector('[onclick="showView(\'prestige\')"]').addEventListener("click", fetchPrestige);

/* ─── PUNTO 4: SKELETON LOADERS ──────────────────────── */
function renderSkeleton(rows, type) {
  if (type === "prestige" || type === "brawler-table") {
    var rowsHtml = "";
    for (var i = 0; i < rows; i++) {
      rowsHtml += '<tr>'
        + '<td><div class="skel skel-sm"></div></td>'
        + '<td><div class="skel skel-md"></div></td>'
        + '<td style="text-align:right"><div class="skel skel-sm" style="margin-left:auto"></div></td>'
        + '</tr>';
    }
    return '<div class="table-wrap skeleton-wrap">'
      + '<table><thead><tr><th>#</th><th>Jugador</th><th>Trofeos/Prestige</th></tr></thead>'
      + '<tbody>' + rowsHtml + '</tbody></table></div>';
  }
  if (type === "profile") {
    return '<div class="profile-card skeleton-wrap">'
      + '<div class="profile-top">'
      +   '<div style="display:flex;gap:14px;align-items:center">'
      +     '<div class="skel skel-avatar"></div>'
      +     '<div>'
      +       '<div class="skel skel-lg" style="margin-bottom:8px"></div>'
      +       '<div class="skel skel-sm"></div>'
      +     '</div>'
      +   '</div>'
      +   '<div class="skel" style="width:90px;height:60px;border-radius:8px"></div>'
      + '</div>'
      + '<div class="stats-grid">'
      +   '<div class="stat-box"><div class="skel skel-sm" style="margin-bottom:8px"></div><div class="skel skel-md"></div></div>'
      +   '<div class="stat-box"><div class="skel skel-sm" style="margin-bottom:8px"></div><div class="skel skel-md"></div></div>'
      +   '<div class="stat-box"><div class="skel skel-sm" style="margin-bottom:8px"></div><div class="skel skel-md"></div></div>'
      +   '<div class="stat-box"><div class="skel skel-sm" style="margin-bottom:8px"></div><div class="skel skel-md"></div></div>'
      + '</div></div>';
  }
  return '<div class="loading">Cargando…</div>';
}

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

  profileEl.innerHTML = renderSkeleton(0, "profile");
  chartSec.style.display    = "none";
  brawlersSec.style.display = "none";

  fetch(API + "/player/" + encodeURIComponent(tag))
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.error) {
        profileEl.innerHTML = '<div class="loading">Jugador no encontrado</div>';
        return;
      }

      // PUNTO 1: Avatar del jugador
      var iconUrl = getPlayerIconUrl(data.icon_id);
      var avatarHtml = iconUrl
        ? '<img src="' + iconUrl + '" alt="avatar" class="player-avatar" onerror="this.style.display=\'none\'">'
        : '<div class="player-avatar-placeholder"></div>';

      // PUNTO 2: Nombre del club en lugar del tag
      var clubDisplay = data.club_name
        ? '<span class="profile-club-name">' + data.club_name + '</span>'
          + (data.club_tag ? '<span class="profile-club-tag"> ' + data.club_tag + '</span>' : '')
        : (data.club_tag ? '<span class="profile-club-tag">' + data.club_tag + '</span>' : 'Sin club');

      profileEl.innerHTML =
        '<div class="profile-card">'
        + '<div class="profile-top">'
        +   '<div style="display:flex;gap:14px;align-items:center">'
        +     avatarHtml
        +     '<div>'
        +       '<div class="profile-name">' + data.name + '</div>'
        +       '<div class="profile-club">' + clubDisplay + '</div>'
        +     '</div>'
        +   '</div>'
        +   '<div class="winstreak-badge">'
        +     '<div class="ws-label">Mejor racha</div>'
        +     '<div class="ws-val">' + icon("winstreak") + ' ' + data.best_winstreak.value + '</div>'
        +     '<div class="ws-brawler">' + data.best_winstreak.brawler + '</div>'
        +   '</div>'
        + '</div>'
        + '<div class="stats-grid">'
        +   '<div class="stat-box"><div class="stat-label">Trofeos máximos</div>'
        +     '<div class="stat-val">' + icon("trophy") + fmt(data.highest_trophies) + '</div></div>'
        +   '<div class="stat-box"><div class="stat-label">Prestige total</div>'
        +     '<div class="stat-val">' + icon("prestige") + fmt(data.total_prestige) + '</div></div>'
        +   '<div class="stat-box"><div class="stat-label">Victorias 3v3</div>'
        +     '<div class="stat-val">' + icon("wins3v3") + fmt(data.wins3v3) + '</div></div>'
        +   '<div class="stat-box"><div class="stat-label">Victorias Solo</div>'
        +     '<div class="stat-val">' + icon("winsSolo") + fmt(data.winsSolo) + '</div></div>'
        + '</div></div>';

      if (data.history && data.history.length > 1) {
        historyData = {
          labels:      data.history.map(function(h) {
            var d  = new Date(h[0]);
            var mm = d.getMinutes() < 10 ? "0" + d.getMinutes() : "" + d.getMinutes();
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
            ? '<span class="attr-pill attr-gadget">' + icon("gadget") + " " + gadgets + '</span>' : "";
          var starPill = stars > 0
            ? '<span class="attr-pill attr-star">' + icon("starpower") + " " + stars + '</span>' : "";
          var hyperPill = hyper > 0
            ? '<span class="attr-pill attr-hyper">' + icon("hypercharge") + " HC</span>' : "";

          return '<div class="brawler-card">'
            + '<div class="brawler-img-wrap">'
            +   imgHtml
            +   '<div class="brawler-img-placeholder" style="display:' + placeholderDisplay + '">' + displayName + '</div>'
            +   '<div class="brawler-power">P' + power + '</div>'
            +   '<div class="brawler-trophies">' + icon("trophy") + ' ' + fmt(trophies) + '</div>'
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

/* ─── TOP BRAWLER con AUTOCOMPLETADO (PUNTO 5) ───────── */
function setupBrawlerAutocomplete() {
  var input    = document.getElementById("brawlerName");
  var dropdown = document.getElementById("brawlerDropdown");

  input.addEventListener("input", function() {
    var val = input.value.trim().toLowerCase();
    if (!val || BRAWLER_LIST.length === 0) {
      dropdown.style.display = "none";
      return;
    }
    var matches = BRAWLER_LIST.filter(function(b) {
      return b.name.toLowerCase().startsWith(val);
    });
    if (matches.length === 0) {
      matches = BRAWLER_LIST.filter(function(b) {
        return b.name.toLowerCase().includes(val);
      });
    }
    matches = matches.slice(0, 6);

    if (matches.length === 0) { dropdown.style.display = "none"; return; }

    dropdown.innerHTML = matches.map(function(b) {
      var imgHtml = b.img
        ? '<img src="' + b.img + '" width="28" height="28" style="border-radius:4px;object-fit:cover;flex-shrink:0" onerror="this.style.display=\'none\'">'
        : '<div style="width:28px;height:28px;background:var(--surface-3);border-radius:4px;flex-shrink:0"></div>';
      return '<div class="autocomplete-item" data-name="' + b.name + '">'
        + imgHtml
        + '<span>' + b.name + '</span>'
        + '</div>';
    }).join("");
    dropdown.style.display = "block";
  });

  dropdown.addEventListener("click", function(e) {
    var item = e.target.closest(".autocomplete-item");
    if (!item) return;
    input.value = item.getAttribute("data-name");
    dropdown.style.display = "none";
    fetchBrawler();
  });

  document.addEventListener("click", function(e) {
    if (!e.target.closest(".search-bar-wrap")) {
      dropdown.style.display = "none";
    }
  });
}

function fetchBrawler() {
  var name      = document.getElementById("brawlerName").value.trim();
  var container = document.getElementById("brawlerList");
  var dropdown  = document.getElementById("brawlerDropdown");
  if (!name) return;
  dropdown.style.display = "none";

  container.innerHTML = renderSkeleton(5, "brawler-table");

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
          + '<td>' + icon("trophy") + fmt(p.trophies) + '</td>'
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
  if (e.key === "Enter") {
    document.getElementById("brawlerDropdown").style.display = "none";
    fetchBrawler();
  }
});

/* ─── INIT ───────────────────────────────────────────── */
loadBrawlerImages();
setupBrawlerAutocomplete();
