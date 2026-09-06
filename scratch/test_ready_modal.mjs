import { spawn } from "child_process";
import fs from "fs";
import http from "http";
import path from "path";

const HTTP_PORT = 8099;
const server = http.createServer((req, res) => {
  let reqPath = req.url.split("?")[0];
  if (reqPath === "/") reqPath = "/index.html";
  const filePath = path.join("/Users/elan/Documents/rusa", reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    let contentType = "text/html";
    if (ext === ".js" || ext === ".mjs") contentType = "application/javascript";
    else if (ext === ".png") contentType = "image/png";
    else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".css") contentType = "text/css";

    res.writeHead(200, { "Content-Type": contentType });
    res.end(fs.readFileSync(filePath));
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

await new Promise(r => server.listen(HTTP_PORT, "127.0.0.1", r));
console.log(`HTTP Server running at http://127.0.0.1:${HTTP_PORT}`);

const CHROME_PORT = 9295;
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  "--headless=new",
  `--remote-debugging-port=${CHROME_PORT}`,
  "--user-data-dir=/tmp/chrome-ready-modal-test-" + Date.now(),
  "--window-size=1280,720"
]);

await new Promise(r => setTimeout(r, 2200));

try {
  const versionRes = await fetch(`http://127.0.0.1:${CHROME_PORT}/json/list`);
  const pages = await versionRes.json();
  const page = pages.find(p => p.type === "page") || pages[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const msgId = id++;
    const timer = setTimeout(() => {
      ws.removeEventListener("message", handler);
      reject(new Error("Timeout calling " + method));
    }, 10000);
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === msgId) {
        clearTimeout(timer);
        ws.removeEventListener("message", handler);
        resolve(data.result);
      }
    };
    ws.addEventListener("message", handler);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await send("Page.enable");
  await send("Runtime.enable");

  const loadPromise = new Promise(resolve => {
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.method === "Page.loadEventFired") {
        ws.removeEventListener("message", handler);
        resolve();
      }
    };
    ws.addEventListener("message", handler);
  });

  await send("Page.navigate", { url: `http://127.0.0.1:${HTTP_PORT}/index.html` });
  await loadPromise;
  console.log("Page loaded successfully!");

  await new Promise(r => setTimeout(r, 1200));

  const evalCode = async (expression) => {
    const res = await send("Runtime.evaluate", { expression, returnByValue: true });
    if (res.exceptionDetails) {
      console.error("Eval exception:", res.exceptionDetails);
    }
    return res.result ? res.result.value : null;
  };

  // 1. Initial State: Menu should be open, Ready modal hidden, Game NOT playing
  const initCheck = await evalCode(`(() => ({
    currentState,
    isMenuOpen: !document.getElementById("menuModal").classList.contains("hidden"),
    isReadyModalOpen: !document.getElementById("readyModal").classList.contains("hidden")
  }))()`);
  console.log("Initial state:", initCheck);

  // 2. Click "MULAI TELUSUR MAP 1: POKJA TKRS"
  console.log("\nClicking btnPlayTKRS from menu...");
  await evalCode(`document.getElementById("btnPlayTKRS").click()`);
  await new Promise(r => setTimeout(r, 400));

  const readyCheckTKRS = await evalCode(`(() => ({
    currentState,
    isMenuOpen: !document.getElementById("menuModal").classList.contains("hidden"),
    isReadyModalOpen: !document.getElementById("readyModal").classList.contains("hidden"),
    mapTitle: document.getElementById("readyModalMapTitle").innerText,
    modeBadge: document.getElementById("readyModalModeBadge").innerText,
    mission: document.getElementById("readyModalMissionText").innerText,
    controls: document.getElementById("readyModalControlsText").innerText
  }))()`);
  console.log("TKRS Ready Modal Opened:", readyCheckTKRS);

  if (readyCheckTKRS.currentState !== "ready") {
    throw new Error("Expected currentState to be 'ready', got: " + readyCheckTKRS.currentState);
  }
  if (!readyCheckTKRS.isReadyModalOpen) {
    throw new Error("Expected readyModal to be open!");
  }

  // Capture screenshot of Ready Briefing Modal
  const snap1 = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync("/Users/elan/.gemini/antigravity-ide/brain/f23f89af-1925-43c2-bd62-e7ae87fea366/ready_modal_tkrs.png", Buffer.from(snap1.data, "base64"));
  console.log("Saved ready_modal_tkrs.png");

  // 3. Click "SAYA SIAP, MULAI SEKARANG!"
  console.log("\nUser confirms readiness: Clicking btnConfirmReady...");
  await evalCode(`document.getElementById("btnConfirmReady").click()`);
  await new Promise(r => setTimeout(r, 200));

  const countdownCheck = await evalCode(`(() => ({
    currentState,
    isCountdownOpen: !document.getElementById("readyCountdownOverlay").classList.contains("hidden"),
    countdownText: document.getElementById("readyCountdownText").innerText
  }))()`);
  console.log("Countdown State:", countdownCheck);

  const snap2 = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync("/Users/elan/.gemini/antigravity-ide/brain/f23f89af-1925-43c2-bd62-e7ae87fea366/ready_countdown_overlay.png", Buffer.from(snap2.data, "base64"));
  console.log("Saved ready_countdown_overlay.png");

  // Wait for countdown to finish (3 x 500ms + 500ms = ~2000ms)
  await new Promise(r => setTimeout(r, 2200));

  const playingCheck = await evalCode(`(() => ({
    currentState,
    isCountdownOpen: !document.getElementById("readyCountdownOverlay").classList.contains("hidden"),
    playerVx: player.vx,
    playerX: player.x,
    playerY: player.y
  }))()`);
  console.log("After Countdown - Playing State:", playingCheck);

  if (playingCheck.currentState !== "playing") {
    throw new Error("Expected game to be in 'playing' state after countdown, got: " + playingCheck.currentState);
  }

  // 4. Test selecting MAP 2 (PMKP) from Pokja List
  console.log("\nTesting selecting MAP 2 from Pokja Select Modal...");
  await evalCode(`document.getElementById("btnPokjaList").click()`);
  await new Promise(r => setTimeout(r, 300));
  await evalCode(`document.getElementById("selectPokjaPMKP").click()`);
  await new Promise(r => setTimeout(r, 400));

  const readyCheckPMKP = await evalCode(`(() => ({
    currentState,
    isReadyModalOpen: !document.getElementById("readyModal").classList.contains("hidden"),
    mapTitle: document.getElementById("readyModalMapTitle").innerText,
    modeBadge: document.getElementById("readyModalModeBadge").innerText,
    mission: document.getElementById("readyModalMissionText").innerText,
    controls: document.getElementById("readyModalControlsText").innerText
  }))()`);
  console.log("PMKP Ready Modal Opened:", readyCheckPMKP);

  if (readyCheckPMKP.currentState !== "ready") {
    throw new Error("Expected currentState to be 'ready' when opening PMKP, got: " + readyCheckPMKP.currentState);
  }

  const snap3 = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync("/Users/elan/.gemini/antigravity-ide/brain/f23f89af-1925-43c2-bd62-e7ae87fea366/ready_modal_pmkp.png", Buffer.from(snap3.data, "base64"));
  console.log("Saved ready_modal_pmkp.png");

  // Confirm PMKP readiness
  await evalCode(`document.getElementById("btnConfirmReady").click()`);
  await new Promise(r => setTimeout(r, 2200));

  const pmkpPlayingCheck = await evalCode(`(() => ({
    currentState,
    currentLevelId: currentLevel.id,
    playerVx: player.vx
  }))()`);
  console.log("PMKP Playing State:", pmkpPlayingCheck);

  if (pmkpPlayingCheck.currentState !== "playing" || pmkpPlayingCheck.currentLevelId !== "PMKP") {
    throw new Error("Expected PMKP to be playing after confirmation, got: " + JSON.stringify(pmkpPlayingCheck));
  }

  console.log("\n>>> ALL READY CONFIRMATION / ABA-ABA TESTS PASSED 100%! <<<");
  ws.close();
} finally {
  chrome.kill();
  server.close();
}
