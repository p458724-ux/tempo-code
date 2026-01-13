/* =========================
   TEMPO CODE – CORE SCRIPT
   ========================= */

const htmlEl = document.getElementById("htmlCode");
const cssEl = document.getElementById("cssCode");
const jsEl = document.getElementById("jsCode");
const pyEl = document.getElementById("pyCode");

const previewFrame = document.getElementById("previewFrame");
const previewBox = document.querySelector(".preview-box");

const tabs = document.querySelectorAll(".tabs button");
const editors = document.querySelectorAll(".editor");

const historyBox = document.getElementById("historyList");

/* =========================
   TAB SWITCHING
   ========================= */

function switchTab(tab) {
  tabs.forEach(b => b.classList.remove("active"));
  editors.forEach(e => e.classList.remove("active"));

  document.querySelector(`[data-tab="${tab}"]`).classList.add("active");
  document.getElementById(tab + "Editor").classList.add("active");

  updatePreview();
}

/* =========================
   PREVIEW SYSTEM
   ========================= */

function updatePreview() {
  if (pyEl.value.trim() !== "") {
    previewBox.style.display = "none";
    return;
  }

  const src = `
<!DOCTYPE html>
<html>
<head>
<style>${cssEl.value}</style>
</head>
<body>
${htmlEl.value}
<script>${jsEl.value}<\/script>
</body>
</html>
`;

  previewFrame.srcdoc = src;
  previewBox.style.display = "block";
}

/* =========================
   HISTORY (OFFLINE)
   ========================= */

function saveHistory() {
  const data = {
    html: htmlEl.value,
    css: cssEl.value,
    js: jsEl.value,
    py: pyEl.value,
    time: new Date().toLocaleString()
  };

  let history = JSON.parse(localStorage.getItem("tempoHistory") || "[]");
  history.unshift(data);
  history = history.slice(0, 10);

  localStorage.setItem("tempoHistory", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  historyBox.innerHTML = "";
  const history = JSON.parse(localStorage.getItem("tempoHistory") || "[]");

  history.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.textContent = `Project ${i + 1} – ${item.time}`;
    div.onclick = () => loadHistory(item);
    historyBox.appendChild(div);
  });
}

function loadHistory(item) {
  htmlEl.value = item.html;
  cssEl.value = item.css;
  jsEl.value = item.js;
  pyEl.value = item.py;
  updatePreview();
}

/* =========================
   DOWNLOAD PROJECT
   ========================= */

function downloadProject() {
  const content = `
<!-- Tempo Code Export -->
${htmlEl.value}

<style>
${cssEl.value}
</style>

<script>
${jsEl.value}
</script>
`;

  const blob = new Blob([content], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "tempo-code-project.html";
  a.click();
}

/* =========================
   EVENTS
   ========================= */

htmlEl.addEventListener("input", updatePreview);
cssEl.addEventListener("input", updatePreview);
jsEl.addEventListener("input", updatePreview);
pyEl.addEventListener("input", updatePreview);

window.addEventListener("beforeunload", saveHistory);

/* =========================
   INIT
   ========================= */

renderHistory();
switchTab("html");

console.log("Tempo Code ready");
