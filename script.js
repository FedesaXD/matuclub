const API = "https://matuclub-api.onrender.com";

/* ─── BRAWLER IMAGE MAP ──────────────────────────────── */
var BRAWLER_IMGS = {};
var BRAWLER_LIST = [];

function loadBrawlerImages() {
  fetch("https://api.brawlify.com/v1/brawlers")
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (!data.list) return;
      data.list.forEach(function(b) {
        BRAWLER_IMGS[b.name.toUpperCase()] = b.imageUrl2 || b.imageUrl;
        BRAWLER_LIST.push({ name: b.name, img: b.imageUrl2 || b.imageUrl });
      });
      BRAWLER_LIST.sort(function(a, b) { return a.name.localeCompare(b.name); });
    })
    .catch(function() {});
}

function getBrawlerImg(name) {
  return BRAWLER_IMGS[name.toUpperCase()] || buildBrawlerImgUrl(name);
}

function buildBrawlerImgUrl(name) {
  var slug = name.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "");
  return "https://cdn.brawlify.com/brawlers/borderless/" + slug + ".png";
}

/* ─── ICONOS SVG ─────────────────────────────────────── */
var ICONS = {
  trophy:      '<svg class="stat-icon-svg" viewBox="0 0 24 24" fill="none"><path d="M6 3h12v7a6 6 0 01-12 0V3z" fill="#ffd700" stroke="#e6b800" stroke-width="1"/><path d="M3 5h3v4a3 3 0 01-3-3V5zM21 5h-3v4a3 3 0 003-3V5z" fill="#ffd700" stroke="#e6b800" stroke-width="1"/><rect x="9" y="16" width="6" height="2" rx="1" fill="#ffd700"/><rect x="7" y="18" width="10" height="2" rx="1" fill="#e6b800"/></svg>',
  prestige:    '<svg class="stat-icon-svg" viewBox="0 0 24 24" fill="none"><polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" fill="#00d4ff" stroke="#0099cc" stroke-width="1"/></svg>',
  wins3v3:     '<svg class="stat-icon-svg" viewBox="0 0 24 24" fill="none"><circle cx="8" cy="8" r="3" fill="#00aaff"/><circle cx="16" cy="8" r="3" fill="#00aaff"/><circle cx="12" cy="6" r="3" fill="#0066ff"/><path d="M2 20c0-4 3-6 6-6h8c3 0 6 2 6 6" stroke="#00aaff" stroke-width="2" fill="none"/></svg>',
  winsSolo:    '<svg class="stat-icon-svg" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="7" r="4" fill="#aa55ff"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#aa55ff" stroke-width="2" fill="none"/></svg>',
  winstreak:   '<svg class="stat-icon-svg" viewBox="0 0 24 24" fill="none"><path d="M12 2c0 0 4 5 4 10a4 4 0 01-8 0c0-2 1-4 1-4s-3 2-3 6a7 7 0 0014 0c0-7-8-12-8-12z" fill="#ff6600" stroke="#cc4400" stroke-width="0.5"/><path d="M12 10c0 0 2 2 2 4a2 2 0 01-4 0c0-1 .5-2 .5-2s-1 1-1 3a2.5 2.5 0 005 0c0-3-2.5-5-2.5-5z" fill="#ffcc00"/></svg>',
  gadget:      '<svg class="stat-icon-svg" viewBox="0 0 24 24" fill="none"><rect x="8" y="3" width="8" height="14" rx="2" fill="#8855ff" stroke="#6633cc" stroke-width="1"/><rect x="10" y="17" width="4" height="4" rx="1" fill="#6633cc"/><circle cx="12" cy="10" r="2" fill="#ccaaff"/></svg>',
  starpower:   '<svg class="stat-icon-svg" viewBox="0 0 24 24" fill="none"><polygon points="12,3 14,9 20,9 15.5,13 17,19 12,16 7,19 8.5,13 4,9 10,9" fill="#ffcc00" stroke="#ff9900" stroke-width="1"/></svg>',
  hypercharge: '<svg class="stat-icon-svg" viewBox="0 0 24 24" fill="none"><polygon points="13,2 13,10 20,10 11,22 11,14 4,14" fill="#00ff99" stroke="#00cc77" stroke-width="1"/></svg>'
};
function icon(key) { return ICONS[key] || ""; }

/* ─── UTILS ──────────────────────────────────────────── */
function showView(id) {
  document.querySelectorAll(".view").forEach(function(v) { v.classList.remove("active"); });
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}

function fmt(n) { return Number(n).toLocaleString("es-UY"); }

/* ─── SKELETON ───────────────────────────────────────── */
function renderSkeleton(rows, type) {
  if (type === "table") {
    var html = "";
    for (var i = 0; i < rows; i++) {
      html += "<tr><td><div class='skel skel-sm'></div></td>"
        + "<td><div class='skel skel-md'></div></td>"
        + "<td style='text-align:right'><div class='skel skel-sm' style='margin-left:auto'></div></td></tr>";
    }
    return "<div class='table-wrap'><table>"
      + "<thead><tr><th>#</th><th>Jugador</th><th>Valor</th></tr></thead>"
      + "<tbody>" + html + "</tbody></table></div>";
  }
  if (type === "profile") {
    return "<div class='profile-card'>"
      + "<div class='profile-top'>"
      +   "<div style='display:flex;gap:14px;align-items:center'>"
      +     "<div class='skel skel-avatar'></div>"
      +     "<div><div class='skel skel-lg' style='margin-bottom:8px'></div><div class='skel skel-sm'></div></div>"
      +   "</div>"
      +   "<div class='skel' style='width:90px;height:88px;border-radius:8px'></div>"
      + "</div>"
      + "<div class='stats-grid'>"
      +   "<div class='stat-box'><div class='skel skel-sm' style='margin-bottom:8px'></div><div class='skel skel-md'></div></div>"
      +   "<div class='stat-box'><div class='skel skel-sm' style='margin-bottom:8px'></div><div class='skel skel-md'></div></div>"
      +   "<div class='stat-box'><div class='skel skel-sm' style='margin-bottom:8px'></div><div class='skel skel-md'></div></div>"
      +   "<div class='stat-box'><div class='skel skel-sm' style='margin-bottom:8px'></div><div class='skel skel-md'></div></div>"
      + "</div></div>";
  }
  return "<div class='loading'>Cargando...</div>";
}

/* ─── TOP JUGADORES ─────────────────────────────────── */
var topCache = {};
var TOP_CONFIG = {
  "prestige":         { col: "Prestige",      extra: null },
  "trophies":         { col: "Trofeos",        extra: null },
  "wins3v3":          { col: "Victorias",      extra: null },
  "winssolo":         { col: "Victorias",      extra: null },
  "winstreak":        { col: "Racha",          extra: "brawler" },
  "brawler-trophies": { col: "Trofeos",        extra: "brawler" }
};

function loadTop(topKey) {
  var container = document.getElementById("topList");
  if (!container) return;
  if (topCache[topKey]) { renderTop(topKey, topCache[topKey]); return; }
  container.innerHTML = renderSkeleton(10, "table");
  fetch(API + "/top/" + topKey)
    .then(function(res) { return res.json(); })
    .then(function(data) { topCache[topKey] = data; renderTop(topKey, data); })
    .catch(function() { container.innerHTML = "<div class='loading'>Error al cargar datos</div>"; });
}

function renderTop(topKey, data) {
  var cfg = TOP_CONFIG[topKey];
  var rows = data.map(function(p) {
    var extra = cfg.extra && p[cfg.extra]
      ? "<span class='top-extra'>" + p[cfg.extra] + "</span>" : "";
    return "<tr class='clickable-row' data-tag='" + p.tag + "' style='cursor:pointer'>"
      + "<td>" + p.rank + "</td>"
      + "<td>" + p.name + extra + "</td>"
      + "<td>" + fmt(p.value) + "</td>"
      + "</tr>";
  }).join("");
  document.getElementById("topList").innerHTML =
    "<div class='table-wrap'>"
    + "<p class='table-hint'>Toca un jugador para ver su perfil</p>"
    + "<table><thead><tr><th>#</th><th>Jugador</th><th>" + cfg.col + "</th></tr></thead>"
    + "<tbody>" + rows + "</tbody></table></div>";
}

/* ─── CLUB MEMBERS ──────────────────────────────────── */
var clubCache = {};

function loadClubMembers(clubNum) {
  var container = document.getElementById("clubMemberList");
  if (!container) return;
  if (clubCache[clubNum]) { renderClubMembers(clubCache[clubNum]); return; }
  container.innerHTML = renderSkeleton(8, "table");
  fetch(API + "/club/" + clubNum + "/members")
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.error) { container.innerHTML = "<div class='loading'>" + data.error + "</div>"; return; }
      clubCache[clubNum] = data;
      renderClubMembers(data);
    })
    .catch(function() { container.innerHTML = "<div class='loading'>Error al cargar miembros</div>"; });
}

function renderClubMembers(data) {
  var rows = data.map(function(m) {
    var av = m.icon_url
      ? "<img src='" + m.icon_url + "' class='member-avatar' onerror='this.onerror=null;this.outerHTML=\"<div class=\\\"member-avatar member-avatar-ph\\\"></div>\"'>"
      : "<div class='member-avatar member-avatar-ph'></div>";
    return "<tr class='clickable-row' data-tag='" + m.tag + "' style='cursor:pointer'>"
      + "<td class='td-rank'>" + m.rank + "</td>"
      + "<td><div class='member-row'>" + av + "<span>" + m.name + "</span></div></td>"
      + "<td><div class='member-trophies-cell'><img src='trophy.webp' class='trophy-inline'><span>" + fmt(m.trophies) + "</span></div></td>"
      + "</tr>";
  }).join("");
  document.getElementById("clubMemberList").innerHTML =
    "<div class='table-wrap'>"
    + "<p class='table-hint'>Toca un jugador para ver su perfil</p>"
    + "<table><thead><tr><th>#</th><th>Jugador</th><th>Trofeos</th></tr></thead>"
    + "<tbody>" + rows + "</tbody></table></div>";
}

/* ─── PLAYER ─────────────────────────────────────────── */
var chart;
var historyData = {};

function goToPlayer(tag) {
  // Si no estamos en la vista player, activarla
  if (!document.getElementById("player").classList.contains("active")) {
    showView("player");
    // Asegurar panels en estado correcto sin triggerar loadClubMembers
    document.getElementById("panel-search").style.display = "none";
    document.getElementById("panel-club").style.display = "block";
  }
  fetchPlayerByTag(tag);
  // Scroll al perfil tras un momento
  setTimeout(function() {
    var el = document.getElementById("playerProfile");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 300);
}

function fetchPlayer() {
  var tag = document.getElementById("playerTag").value.trim();
  if (!tag) return;
  if (tag[0] !== "#") tag = "#" + tag;
  fetchPlayerByTag(tag);
}

function fetchPlayerByTag(tag) {
  if (!tag) return;
  if (tag[0] !== "#") tag = "#" + tag;

  var profileEl   = document.getElementById("playerProfile");
  var chartSec    = document.getElementById("chartSection");
  var brawlersSec = document.getElementById("brawlersSection");

  if (!profileEl) { console.error("playerProfile no encontrado para tag:", tag); return; }
  profileEl.innerHTML = renderSkeleton(0, "profile");
  chartSec.style.display    = "none";
  brawlersSec.style.display = "none";

  fetch(API + "/player/" + encodeURIComponent(tag))
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.error) {
        profileEl.innerHTML = "<div class='loading'>Jugador no encontrado</div>";
        return;
      }

      var iconUrl = data.icon_url || null;
      var clubDisplay = data.club_name
        ? "<span class='profile-club-name'>" + data.club_name + "</span>"
          + (data.club_tag ? " <span class='profile-club-tag'>" + data.club_tag + "</span>" : "")
        : (data.club_tag || "Sin club");

      var prestigeBadge =
        "<div class='prestige-badge'>"
        + "<img src='totalprestige.webp' class='prestige-badge-img' alt='prestige'/>"
        + "<span class='prestige-badge-num'>" + fmt(data.total_prestige) + "</span>"
        + "</div>";

      var avatarHtml = iconUrl
        ? "<img src='" + iconUrl + "' alt='avatar' class='player-avatar'"
          + " onerror='this.style.display=\"none\";this.nextElementSibling.style.display=\"flex\"'>"
          + "<div class='player-avatar-placeholder' style='display:none'></div>"
        : "<div class='player-avatar-placeholder'></div>";

      profileEl.innerHTML =
        "<div class='profile-card'>"
        + "<div class='profile-top'>"
        +   "<div style='display:flex;gap:14px;align-items:center'>"
        +     avatarHtml
        +     "<div>"
        +       "<div class='profile-name'>" + data.name + "</div>"
        +       "<div class='profile-club'>" + clubDisplay + "</div>"
        +     "</div>"
        +   "</div>"
        +   prestigeBadge
        + "</div>"
        + "<div class='stats-grid'>"
        +   "<div class='stat-box'><div class='stat-label'>Trofeos maximos</div>"
        +     "<div class='stat-val stat-val-img'><img src='trophy.webp' class='stat-asset-img'>" + fmt(data.highest_trophies) + "</div></div>"
        +   "<div class='stat-box'><div class='stat-label'>Mejor racha</div>"
        +     "<div class='stat-val stat-ws-val'><span class='ws-fire'>&#x1F525;</span><span class='ws-number'>" + data.best_winstreak.value + "</span></div>"
        +     "<div class='stat-ws-brawler'>" + data.best_winstreak.brawler + "</div></div>"
        +   "<div class='stat-box'><div class='stat-label'>Victorias 3v3</div>"
        +     "<div class='stat-val stat-val-img'><img src='3v3.webp' class='stat-asset-img'>" + fmt(data.wins3v3) + "</div></div>"
        +   "<div class='stat-box'><div class='stat-label'>Victorias Solo</div>"
        +     "<div class='stat-val stat-val-img'><img src='showdown.webp' class='stat-asset-img'>" + fmt(data.winsSolo) + "</div></div>"
        + "</div></div>";

      if (data.history && data.history.length > 1) {
        historyData = {
          labels:      data.history.map(function(h) {
            var d = new Date(h[0]);
            var mm = d.getMinutes() < 10 ? "0" + d.getMinutes() : "" + d.getMinutes();
            return d.getDate() + "/" + (d.getMonth()+1) + " " + d.getHours() + ":" + mm;
          }),
          trophies:    data.history.map(function(h) { return h[1]; }),
          wins3v3:     data.history.map(function(h) { return h[2]; }),
          winsSolo:    data.history.map(function(h) { return h[3]; }),
          prestigeLvl: data.history.map(function(h) { return h[4]; })
        };
        chartSec.style.display = "block";
        document.querySelectorAll(".tab[data-tab]").forEach(function(t) { t.classList.remove("active"); });
        document.querySelector(".tab[data-tab='trophies']").classList.add("active");
        renderChart("trophies");
      }

      if (data.top_brawlers && data.top_brawlers.length > 0) {
        brawlersSec.style.display = "block";
        document.getElementById("brawlerGrid").innerHTML = data.top_brawlers.map(function(b) {
          var bName = b[0], power = b[1], gadgets = b[2], stars = b[3], hyper = b[4], trophies = b[5];
          var displayName = bName.toLowerCase().replace(/\b\w/g, function(c) { return c.toUpperCase(); });
          var imgUrl = getBrawlerImg(bName);
          var imgHtml = imgUrl ? "<img src='" + imgUrl + "' alt='" + displayName + "' class='brawler-main-img'>" : "";
          var phDisplay = imgUrl ? "none" : "flex";
          var gIcons = "", sIcons = "", hIcons = "";
          for (var gi = 0; gi < gadgets; gi++) gIcons += "<img src='gadget.png' class='attr-icon-img'>";
          for (var si = 0; si < stars;   si++) sIcons += "<img src='starpower.webp' class='attr-icon-img'>";
          for (var hi = 0; hi < hyper;   hi++) hIcons += "<img src='hipercharge.webp' class='attr-icon-img attr-icon-hc'>";
          return "<div class='brawler-card'>"
            + "<div class='brawler-img-wrap'>"
            +   imgHtml
            +   "<div class='brawler-img-placeholder' style='display:" + phDisplay + "'>" + displayName + "</div>"
            +   "<div class='brawler-power-wrap'><img src='powerlevel.webp' class='brawler-power-img'><span class='brawler-power-num'>" + power + "</span></div>"
            +   "<div class='brawler-trophies'><img src='trophy.webp' class='trophy-icon-img'><span>" + fmt(trophies) + "</span></div>"
            + "</div>"
            + "<div class='brawler-info'>"
            +   "<div class='brawler-name'>" + displayName + "</div>"
            +   "<div class='brawler-attrs'>" + gIcons + sIcons + hIcons + "</div>"
            + "</div></div>";
        }).join("");
      }
    })
    .catch(function(e) {
      profileEl.innerHTML = "<div class='loading'>Error al cargar jugador</div>";
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
  var cfg = CHART_CONFIG[key];
  if (chart) chart.destroy();
  Chart.defaults.color = "#4a6a85";
  Chart.defaults.font.family = "'DM Sans', sans-serif";
  chart = new Chart(document.getElementById("chart"), {
    type: "line",
    data: {
      labels: historyData.labels,
      datasets: [{
        label: cfg.label, data: historyData[key],
        borderColor: cfg.color, backgroundColor: hexAlpha(cfg.color, 0.08),
        borderWidth: 2, pointRadius: 3, pointBackgroundColor: cfg.color,
        pointBorderColor: "transparent", tension: 0.4, fill: true
      }]
    },
    options: {
      responsive: true, interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#07111f", borderColor: "rgba(0,160,255,0.2)", borderWidth: 1,
          titleColor: "#ddeeff", bodyColor: "#4a6a85", padding: 12,
          callbacks: { label: function(ctx) { return cfg.label + ": " + fmt(ctx.parsed.y); } }
        }
      },
      scales: {
        x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#4a6a85", maxTicksLimit: 8, maxRotation: 0 } },
        y: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#4a6a85", callback: function(v) { return fmt(v); } } }
      }
    }
  });
}

function hexAlpha(hex, alpha) {
  var r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
}

/* ─── TOP BRAWLER (buscar por nombre) ────────────────── */
function fetchBrawler() {
  var name      = document.getElementById("brawlerName").value.trim();
  var container = document.getElementById("brawlerList");
  var dropdown  = document.getElementById("brawlerDropdown");
  if (!name) return;
  dropdown.style.display = "none";
  container.innerHTML = renderSkeleton(5, "table");
  fetch(API + "/top/brawler/" + encodeURIComponent(name))
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.error) { container.innerHTML = "<div class='loading'>No hay datos para este brawler</div>"; return; }
      var rows = data.map(function(p) {
        return "<tr class='clickable-row' data-tag='" + p.tag + "' style='cursor:pointer'>"
          + "<td>" + p.rank + "</td><td>" + p.name + "</td>"
          + "<td><img src='trophy.webp' class='trophy-inline'>" + fmt(p.trophies) + "</td>"
          + "</tr>";
      }).join("");
      container.innerHTML = "<div class='table-wrap'>"
        + "<p class='table-hint'>Toca un jugador para ver su perfil</p>"
        + "<table><thead><tr><th>#</th><th>Jugador</th><th>Trofeos</th></tr></thead>"
        + "<tbody>" + rows + "</tbody></table></div>";
    })
    .catch(function() { container.innerHTML = "<div class='loading'>Error al cargar datos</div>"; });
}

/* ─── EVENT DELEGATION GLOBAL ────────────────────────── */
document.addEventListener("click", function(e) {
  // Filas de tabla → perfil jugador
  var row = e.target.closest("tr[data-tag]");
  if (row) { goToPlayer(row.getAttribute("data-tag")); return; }

  // Tabs de top jugadores
  var topTab = e.target.closest(".top-tab");
  if (topTab) {
    document.querySelectorAll(".top-tab").forEach(function(t) { t.classList.remove("active"); });
    topTab.classList.add("active");
    loadTop(topTab.getAttribute("data-top"));
    return;
  }

  // Tabs de clubs
  var playerTab = e.target.closest(".player-tab");
  if (playerTab) {
    document.querySelectorAll(".player-tab").forEach(function(t) { t.classList.remove("active"); });
    playerTab.classList.add("active");
    var club = playerTab.getAttribute("data-club");
    document.getElementById("playerProfile").innerHTML = "";
    document.getElementById("chartSection").style.display = "none";
    document.getElementById("brawlersSection").style.display = "none";
    if (club === "search") {
      document.getElementById("panel-search").style.display = "block";
      document.getElementById("panel-club").style.display = "none";
    } else {
      document.getElementById("panel-search").style.display = "none";
      document.getElementById("panel-club").style.display = "block";
      loadClubMembers(club);
    }
    return;
  }
});

/* ─── INIT ───────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", function() {

  // Navegacion principal
  document.getElementById("btn-prestige").addEventListener("click", function() {
    showView("prestige");
    document.querySelectorAll(".top-tab").forEach(function(t) { t.classList.remove("active"); });
    document.querySelector(".top-tab[data-top='prestige']").classList.add("active");
    loadTop("prestige");
  });

  document.getElementById("btn-player").addEventListener("click", function() {
    showView("player");
    document.querySelectorAll(".player-tab").forEach(function(t) { t.classList.remove("active"); });
    document.querySelector(".player-tab[data-club='1']").classList.add("active");
    document.getElementById("panel-search").style.display = "none";
    document.getElementById("panel-club").style.display = "block";
    loadClubMembers("1");
  });

  document.getElementById("btn-brawler").addEventListener("click", function() {
    showView("brawler");
  });

  // Botones volver
  document.getElementById("btn-back-prestige").addEventListener("click", function() { showView("home"); });
  document.getElementById("btn-back-player").addEventListener("click",   function() { showView("home"); });
  document.getElementById("btn-back-brawler").addEventListener("click",  function() { showView("home"); });

  // Busquedas
  document.getElementById("btn-search-player").addEventListener("click", fetchPlayer);
  document.getElementById("btn-search-brawler").addEventListener("click", fetchBrawler);

  // Enter en inputs
  document.getElementById("playerTag").addEventListener("keydown", function(e) {
    if (e.key === "Enter") fetchPlayer();
  });
  document.getElementById("brawlerName").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      document.getElementById("brawlerDropdown").style.display = "none";
      fetchBrawler();
    }
  });

  // Tabs del grafico
  document.querySelectorAll(".tab[data-tab]").forEach(function(btn) {
    btn.addEventListener("click", function() {
      document.querySelectorAll(".tab[data-tab]").forEach(function(t) { t.classList.remove("active"); });
      btn.classList.add("active");
      renderChart(btn.getAttribute("data-tab"));
    });
  });

  // Autocomplete brawler
  var brawlerInput = document.getElementById("brawlerName");
  var dropdown     = document.getElementById("brawlerDropdown");

  brawlerInput.addEventListener("input", function() {
    var val = brawlerInput.value.trim().toLowerCase();
    if (!val || BRAWLER_LIST.length === 0) { dropdown.style.display = "none"; return; }
    var matches = BRAWLER_LIST.filter(function(b) { return b.name.toLowerCase().startsWith(val); });
    if (matches.length === 0)
      matches = BRAWLER_LIST.filter(function(b) { return b.name.toLowerCase().includes(val); });
    matches = matches.slice(0, 6);
    if (matches.length === 0) { dropdown.style.display = "none"; return; }
    dropdown.innerHTML = matches.map(function(b) {
      var imgHtml = b.img
        ? "<img src='" + b.img + "' width='28' height='28' style='border-radius:4px;object-fit:cover;flex-shrink:0' onerror='this.style.display=\"none\"'>"
        : "<div style='width:28px;height:28px;background:var(--surface-3);border-radius:4px;flex-shrink:0'></div>";
      return "<div class='autocomplete-item' data-name='" + b.name + "'>" + imgHtml + "<span>" + b.name + "</span></div>";
    }).join("");
    dropdown.style.display = "block";
  });

  dropdown.addEventListener("click", function(e) {
    var item = e.target.closest(".autocomplete-item");
    if (!item) return;
    brawlerInput.value = item.getAttribute("data-name");
    dropdown.style.display = "none";
    fetchBrawler();
  });

  document.addEventListener("click", function(e) {
    if (!e.target.closest(".search-bar-wrap")) dropdown.style.display = "none";
  });

  loadBrawlerImages();
  loadPlayerOfDay();

  // Eventos
  document.getElementById("btn-eventos").addEventListener("click", function() {
    showView("eventos");
    loadEventos();
  });
  document.getElementById("btn-back-eventos").addEventListener("click", function() { showView("home"); });

  // Jugador del día
  document.getElementById("btn-pod-ver").addEventListener("click", function() {
    showView("pod");
    renderPodList();
  });
  document.getElementById("btn-back-pod").addEventListener("click", function() { showView("home"); });
});

/* ─── EVENTOS ────────────────────────────────────────── */

function loadEventos() {
  var container = document.getElementById("eventosContent");
  if (!container) return;
  container.innerHTML = "<div class='loading'>Cargando eventos...</div>";

  fetch(API + "/events")
    .then(function(res) { return res.json(); })
    .then(function(events) {
      if (!events || events.length === 0) {
        container.innerHTML = renderEventosEmpty();
        return;
      }
      container.innerHTML = events.map(function(ev) {
        return renderEventCard(ev);
      }).join("");

      // Start live countdowns for active events
      events.forEach(function(ev) {
        if (ev.is_active && ev.ends_at) {
          startEventCountdown(ev.id, ev.ends_at);
        }
      });
    })
    .catch(function() {
      container.innerHTML = "<div class='loading'>Error al cargar eventos</div>";
    });
}

function renderEventosEmpty() {
  return "<div class='ev-empty'>"
    + "<div class='ev-empty-icon'>🏆</div>"
    + "<div class='ev-empty-title'>Sin eventos por ahora</div>"
    + "<div class='ev-empty-sub'>El admin activará un evento pronto. ¡Estate atento!</div>"
    + "</div>";
}

function renderEventCard(ev) {
  var isActive = ev.is_active;
  var statusClass = isActive ? "ev-status ev-status-active" : "ev-status ev-status-closed";
  var statusLabel = isActive ? "● EN CURSO" : "✓ FINALIZADO";

  var dateStr = "";
  if (isActive && ev.ends_at) {
    dateStr = "<div class='ev-countdown' id='ev-countdown-" + ev.id + "'>Calculando...</div>";
  } else if (ev.closed_at) {
    var d = new Date(ev.closed_at);
    dateStr = "<div class='ev-date'>Cerrado el " + d.toLocaleDateString("es-UY", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }) + "</div>";
  }

  var metricLabel = {
    "trophies":        "Copas subidas",
    "wins3v3":         "Victorias 3v3",
    "winsSolo":        "Victorias Solo",
    "prestige":        "Prestige subido",
    "brawler_trophies": "Copas con " + (ev.brawler_name || "brawler")
  }[ev.metric] || ev.metric;

  var metricBadge = "";
  if (ev.metric === "brawler_trophies" && ev.brawler_name) {
    var bImg = getBrawlerImg(ev.brawler_name);
    var bDisplay = ev.brawler_name.toLowerCase().replace(/\b\w/g, function(c) { return c.toUpperCase(); });
    metricBadge = "<div class='ev-brawler-badge'>"
      + "<img src='" + bImg + "' class='ev-brawler-img' onerror='this.style.display=\"none\"'>"
      + "<span>" + bDisplay + "</span>"
      + "</div>";
  }

  var topParticipants = (ev.participants || []).slice(0, 3);
  var podiumHtml = "";
  if (topParticipants.length > 0) {
    podiumHtml = "<div class='ev-podium'>" + topParticipants.map(function(p, i) {
      var medals = ["🥇","🥈","🥉"];
      var av = p.icon_url
        ? "<img src='" + p.icon_url + "' class='ev-avatar' onerror='this.onerror=null;this.outerHTML=\"<div class=\\\"ev-avatar ev-avatar-ph\\\"></div>\"'>"
        : "<div class='ev-avatar ev-avatar-ph'></div>";
      var deltaSign = p.delta > 0 ? "+" : "";
      return "<div class='ev-podium-item'>"
        + "<span class='ev-medal'>" + medals[i] + "</span>"
        + av
        + "<span class='ev-pname'>" + p.name + "</span>"
        + "<span class='ev-pdelta " + (p.delta >= 0 ? "pos" : "neg") + "'>"
        + deltaSign + fmt(p.delta) + " " + metricLabel
        + "</span>"
        + "</div>";
    }).join("") + "</div>";
  }

  var toggleId = "ev-table-" + ev.id;
  var hasMore = ev.participants && ev.participants.length > 3;
  var showAllBtn = hasMore
    ? "<button class='ev-show-all' onclick='toggleEvTable(\"" + toggleId + "\", this)'>Ver todos (" + ev.participants.length + ")</button>"
    : "";

  var tableHtml = "";
  if (ev.participants && ev.participants.length > 0) {
    tableHtml = "<div class='ev-table-wrap' id='" + toggleId + "' style='display:none'>"
      + "<div class='table-wrap'><table>"
      + "<thead><tr><th>#</th><th>Jugador</th><th>" + metricLabel + "</th></tr></thead>"
      + "<tbody>"
      + ev.participants.map(function(p) {
          var deltaSign = p.delta > 0 ? "+" : "";
          var deltaClass = p.delta > 0 ? "ev-delta-pos" : (p.delta < 0 ? "ev-delta-neg" : "");
          return "<tr>"
            + "<td>" + p.rank + "</td>"
            + "<td>" + p.name + "</td>"
            + "<td class='" + deltaClass + "'>" + deltaSign + fmt(p.delta) + "</td>"
            + "</tr>";
        }).join("")
      + "</tbody></table></div></div>";
  }

  return "<div class='ev-card " + (isActive ? "ev-card-active" : "") + "'>"
    + "<div class='ev-card-top'>"
    +   "<div class='" + statusClass + "'>" + statusLabel + "</div>"
    +   dateStr
    + "</div>"
    + "<div class='ev-title'>" + ev.title + "</div>"
    + (ev.description ? "<div class='ev-desc'>" + ev.description + "</div>" : "")
    + "<div class='ev-reward'><span class='ev-reward-label'>Recompensa</span><span class='ev-reward-val'>" + ev.reward + "</span></div>"
    + metricBadge
    + podiumHtml
    + showAllBtn
    + tableHtml
    + "</div>";
}

function toggleEvTable(id, btn) {
  var el = document.getElementById(id);
  if (!el) return;
  var visible = el.style.display !== "none";
  el.style.display = visible ? "none" : "block";
  btn.textContent = visible
    ? btn.textContent.replace("Ocultar", "Ver todos")
    : btn.textContent.replace("Ver todos", "Ocultar");
}

function startEventCountdown(eventId, endsAt) {
  var endMs = new Date(endsAt).getTime();
  var el = document.getElementById("ev-countdown-" + eventId);
  if (!el) return;

  function tick() {
    var now = Date.now();
    var diff = endMs - now;
    if (!document.getElementById("ev-countdown-" + eventId)) return; // view changed
    if (diff <= 0) {
      el.textContent = "Finalizando...";
      setTimeout(loadEventos, 2000);
      return;
    }
    var h = Math.floor(diff / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    var pad = function(n) { return n < 10 ? "0" + n : "" + n; };
    el.textContent = "Termina en " + (h > 0 ? h + "h " : "") + pad(m) + "m " + pad(s) + "s";
    setTimeout(tick, 1000);
  }
  tick();
}

/* ─── TIEMPO RELATIVO ────────────────────────────────── */
function timeAgo(isoStr) {
  if (!isoStr) return null;
  var then = new Date(isoStr).getTime();
  if (isNaN(then)) return null;
  var diff = Math.floor((Date.now() - then) / 1000);
  if (diff < 60)  return "Datos actualizados hace " + diff + " segundo" + (diff === 1 ? "" : "s");
  var m = Math.floor(diff / 60);
  if (m < 60)    return "Datos actualizados hace " + m + " minuto" + (m === 1 ? "" : "s");
  var h = Math.floor(m / 60);
  if (h < 24)    return "Datos actualizados hace " + h + " hora" + (h === 1 ? "" : "s");
  var d = Math.floor(h / 24);
  return "Datos actualizados hace " + d + " día" + (d === 1 ? "" : "s");
}

function showLastUpdated(isoStr) {
  var el = document.getElementById("home-last-updated");
  if (!el) return;
  var text = timeAgo(isoStr);
  if (text) { el.textContent = text; el.style.display = "block"; }
}

/* ─── JUGADOR DEL DÍA ────────────────────────────────── */
var podData = null;

function loadPlayerOfDay() {
  var card     = document.getElementById("pod-home-card");
  var skeleton = document.getElementById("pod-home-skeleton");
  if (!card || !skeleton) return;

  skeleton.style.display = "block";
  card.style.display     = "none";

  fetch(API + "/player-of-day")
    .then(function(res) { return res.json(); })
    .then(function(data) {
      podData = data;
      skeleton.style.display = "none";

      // Show last_updated in home if available
      var arr = Array.isArray(data) ? data : (data.data || []);
      var meta = !Array.isArray(data) ? data : null;
      var updatedAt = (meta && (meta.last_updated || meta.updated_at))
        || (arr[0] && (arr[0].last_updated || arr[0].updated_at))
        || null;
      showLastUpdated(updatedAt);
      if (Array.isArray(data)) { podData = data; } else { podData = arr; }

      var today = podData.find(function(d) { return d.is_today; });
      if (!today) return;

      var podAvatar = document.getElementById("pod-home-avatar");
      var podAvatarPh = podAvatar.nextElementSibling;
      podAvatar.style.display = "";
      if (podAvatarPh) podAvatarPh.style.display = "none";
      podAvatar.src = today.icon_url || "";
      document.getElementById("pod-home-name").textContent  = today.player_name;
      document.getElementById("pod-home-club").textContent  = today.club_name || "";
      document.getElementById("pod-home-pts").textContent   = today.points + " puntos hoy";
      card.style.display = "block";
    })
    .catch(function() {
      skeleton.style.display = "none";
    });
}

function renderPodList() {
  var container = document.getElementById("podList");
  if (!container) return;

  if (!podData || podData.length === 0) {
    container.innerHTML = "<div class='loading'>No hay datos disponibles todavía.</div>";
    return;
  }

  var DAYS_ES = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
  var MONTHS_ES = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];

  container.innerHTML = podData.map(function(d) {
    var dateObj = new Date(d.day + "T00:00:00");
    var dayName = DAYS_ES[dateObj.getDay()];
    var dateStr = dayName.charAt(0).toUpperCase() + dayName.slice(1)
                  + " " + dateObj.getDate()
                  + " " + MONTHS_ES[dateObj.getMonth()];
    var label = d.is_today ? "⭐ Hoy — " + dateStr : dateStr;

    var avatar = d.icon_url
      ? "<img class='pod-card-avatar' src='" + d.icon_url + "' onerror='this.onerror=null;this.outerHTML=\"<div class=\\\"pod-card-avatar pod-card-avatar-ph\\\"></div>\"'>"
      : "<div class='pod-card-avatar'></div>";

    var deltas = [];
    if (d.delta_trophies  > 0) deltas.push("🏆 +<span>" + fmt(d.delta_trophies)  + "</span> trofeos");
    if (d.delta_wins3v3   > 0) deltas.push("🤝 +<span>" + fmt(d.delta_wins3v3)   + "</span> victorias 3v3");
    if (d.delta_winsSolo  > 0) deltas.push("🎯 +<span>" + fmt(d.delta_winsSolo)  + "</span> victorias solo");
    if (d.delta_prestige  > 0) deltas.push("✨ +<span>" + fmt(d.delta_prestige)  + "</span> prestige");

    var deltasHtml = deltas.length
      ? "<div class='pod-card-deltas'>" + deltas.map(function(s) {
          return "<div class='pod-delta'>" + s + "</div>";
        }).join("") + "</div>"
      : "";

    return "<div class='pod-card" + (d.is_today ? " pod-today" : "") + "'>"
      + "<div class='pod-card-top'>"
      +   avatar
      +   "<div class='pod-card-info'>"
      +     "<div class='pod-card-date'>" + label + "</div>"
      +     "<div class='pod-card-name'>" + d.player_name + "</div>"
      +     "<div class='pod-card-club'>" + (d.club_name || "") + "</div>"
      +   "</div>"
      +   "<div class='pod-card-pts'>" + fmt(d.points) + " pts</div>"
      + "</div>"
      + deltasHtml
      + "</div>";
  }).join("");
}
