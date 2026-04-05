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
        var img = b.imageUrl2 || b.imageUrl || null;
        BRAWLER_IMGS[b.name.toUpperCase()] = img;
        BRAWLER_LIST.push({ name: b.name, img: img });
      });
      BRAWLER_LIST.sort(function(a, b) { return a.name.localeCompare(b.name); });
    })
    .catch(function() {
      console.warn("No se pudo cargar lista de brawlers");
    });
}

function buildBrawlerImgUrl(name) {
  var slug = name.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "");
  return "https://cdn.brawlify.com/brawlers/borderless/" + slug + ".png";
}

function getBrawlerImg(name) {
  return BRAWLER_IMGS[name.toUpperCase()] || buildBrawlerImgUrl(name);
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
  document.querySelectorAll(".view").forEach(function(v) {
    v.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}

function fmt(n) { return Number(n).toLocaleString("es-UY"); }

function goToPlayer(tag) {
  var alreadyInPlayer = document.getElementById("player").classList.contains("active");
  if (!alreadyInPlayer) {
    // Venimos de otra vista - activar sin disparar el btn-player listener
    document.querySelectorAll(".view").forEach(function(v) { v.classList.remove("active"); });
    document.getElementById("player").classList.add("active");
    window.scrollTo(0, 0);
  }
  // Scroll al perfil
  setTimeout(function() {
    var el = document.getElementById("playerProfile");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
  fetchPlayerByTag(tag);
}

/* ─── SKELETON ───────────────────────────────────────── */
function renderSkeleton(rows, type) {
  if (type === "table") {
    var html = "";
    for (var i = 0; i < rows; i++) {
      html += "<tr>"
        + "<td><div class='skel skel-sm'></div></td>"
        + "<td><div class='skel skel-md'></div></td>"
        + "<td style='text-align:right'><div class='skel skel-sm' style='margin-left:auto'></div></td>"
        + "</tr>";
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
      +   "<div class='skel' style='width:90px;height:60px;border-radius:8px'></div>"
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
  prestige:         { label: "Prestige",        col: "Prestige",       extra: null },
  trophies:         { label: "Trofeos",          col: "Trofeos",        extra: null },
  wins3v3:          { label: "Victorias 3v3",    col: "Victorias",      extra: null },
  winssolo:         { label: "Victorias Solo",   col: "Victorias",      extra: null },
  winstreak:        { label: "Racha",            col: "Racha",          extra: "brawler" },
  "brawler-trophies": { label: "Mejor Brawler", col: "Trofeos",        extra: "brawler" }
};

function loadTop(topKey) {
  var container = document.getElementById("topList");
  if (!container) { console.error("topList no encontrado"); return; }
  if (topCache[topKey]) { renderTop(topKey, topCache[topKey]); return; }
  container.innerHTML = renderSkeleton(10, "table");
  var url = API + "/top/" + topKey;
  console.log("loadTop fetch:", url);
  fetch(url)
    .then(function(res) { return res.json(); })
    .then(function(data) {
      console.log("loadTop data recibida:", topKey, Array.isArray(data) ? data.length + " items" : data);
      topCache[topKey] = data;
      renderTop(topKey, data);
    })
    .catch(function(e) {
      console.error("loadTop error:", e);
      container.innerHTML = "<div class='loading'>Error al cargar datos</div>";
    });
}

function renderTop(topKey, data) {
  var cfg  = TOP_CONFIG[topKey];
  var rows = data.map(function(p) {
    var extra = cfg.extra && p[cfg.extra]
      ? "<span class='top-extra'>" + p[cfg.extra] + "</span>"
      : "";
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
  if (clubCache[clubNum]) { renderClubMembers(clubCache[clubNum]); return; }
  container.innerHTML = renderSkeleton(8, "table");
  fetch(API + "/club/" + clubNum + "/members")
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.error) { container.innerHTML = "<div class='loading'>" + data.error + "</div>"; return; }
      clubCache[clubNum] = data;
      renderClubMembers(data);
    })
    .catch(function() {
      container.innerHTML = "<div class='loading'>Error al cargar miembros</div>";
    });
}

function renderClubMembers(data) {
  var rows = data.map(function(m) {
    var av = m.icon_url
      ? "<img src='" + m.icon_url + "' class='member-avatar' onerror='this.style.display=\"none\"'>" 
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

/* ─── CLICK EN FILAS (scope global para evitar conflictos) ── */
document.addEventListener("click", function(e) {
  var row = e.target.closest("tr[data-tag]");
  if (row) goToPlayer(row.getAttribute("data-tag"));
});

/* ─── INIT (todo dentro de DOMContentLoaded) ─────────── */
document.addEventListener("DOMContentLoaded", function() {

  /* Navegación home */
  document.getElementById("btn-prestige").addEventListener("click", function() {
    showView("prestige");
    // Activar primera tab y cargar prestige
    document.querySelectorAll(".top-tab").forEach(function(t) { t.classList.remove("active"); });
    var t1 = document.querySelector(".top-tab[data-top='prestige']");
    if (t1) t1.classList.add("active");
    loadTop("prestige");
  });
  document.getElementById("btn-player").addEventListener("click", function() {
    showView("player");
    // Activar tab 1 y cargar sus miembros
    document.querySelectorAll(".player-tab").forEach(function(t) { t.classList.remove("active"); });
    var t1 = document.querySelector(".player-tab[data-club='1']");
    if (t1) t1.classList.add("active");
    document.getElementById("panel-search").style.display = "none";
    document.getElementById("panel-club").style.display = "block";
    loadClubMembers("1");
  });
  document.getElementById("btn-brawler").addEventListener("click", function() {
    showView("brawler");
  });

  /* Botones volver */
  document.getElementById("btn-back-prestige").addEventListener("click", function() { showView("home"); });
  document.getElementById("btn-back-player").addEventListener("click",   function() { showView("home"); });
  document.getElementById("btn-back-brawler").addEventListener("click",  function() { showView("home"); });

  /* Búsquedas */
  document.getElementById("btn-search-player").addEventListener("click", fetchPlayer);
  document.getElementById("btn-search-brawler").addEventListener("click", fetchBrawler);

  /* Enter en inputs */
  document.getElementById("playerTag").addEventListener("keydown", function(e) {
    if (e.key === "Enter") fetchPlayer();
  });
  document.getElementById("brawlerName").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      document.getElementById("brawlerDropdown").style.display = "none";
      fetchBrawler();
    }
  });

  /* Tabs del gráfico */
  document.querySelectorAll(".tab[data-tab]").forEach(function(btn) {
    btn.addEventListener("click", function() {
      document.querySelectorAll(".tab").forEach(function(t) { t.classList.remove("active"); });
      btn.classList.add("active");
      renderChart(btn.getAttribute("data-tab"));
    });
  });

  /* Click en filas de tabla: listener movido al scope global */

  /* Tabs de top jugadores */
  document.querySelectorAll(".top-tab").forEach(function(tab) {
    tab.addEventListener("click", function() {
      document.querySelectorAll(".top-tab").forEach(function(t) { t.classList.remove("active"); });
      tab.classList.add("active");
      loadTop(tab.getAttribute("data-top"));
    });
  });

  /* Tabs de clubs en vista jugador */
  document.querySelectorAll(".player-tab").forEach(function(tab) {
    tab.addEventListener("click", function() {
      document.querySelectorAll(".player-tab").forEach(function(t) { t.classList.remove("active"); });
      tab.classList.add("active");
      var club = tab.getAttribute("data-club");
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
    });
  });

  /* Autocomplete brawler */
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
        ? "<img src='" + b.img + "' width='28' height='28' style='border-radius:4px;object-fit:cover;flex-shrink:0' onerror=\"this.style.display='none'\">"
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

  /* Init */
  loadBrawlerImages();
});
