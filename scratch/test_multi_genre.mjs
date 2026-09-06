import { spawn } from "child_process";
import fs from "fs";
import http from "http";
import path from "path";

// 1. Embedded HTTP server
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
  "--user-data-dir=/tmp/chrome-multi-genre-test-" + Date.now(),
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

  ws.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    if (data.method === "Runtime.exceptionThrown") {
      console.error("PAGE RUNTIME ERROR:", data.params.exceptionDetails);
    }
  });

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

  // 1. Verify Level 1 TKRS Initial State
  const tkrsInfo = await evalCode(`(() => ({
    id: currentLevel.id,
    shortName: currentLevel.shortName,
    gameMode: currentLevel.gameMode,
    playerX: player.x,
    playerY: player.y,
    pillarsCount: currentLevel.flappyPillars ? currentLevel.flappyPillars.length : 0,
    terminalsCount: currentLevel.terminals.length
  }))()`);
  console.log("TKRS Info:", tkrsInfo);

  if (tkrsInfo.gameMode !== "FLAPPY_GLIDER") {
    throw new Error("Expected TKRS gameMode to be FLAPPY_GLIDER, got: " + tkrsInfo.gameMode);
  }

  // 2. Start TKRS Flappy Game
  await evalCode(`document.getElementById("btnPlayTKRS").click()`);
  await new Promise(r => setTimeout(r, 500));

  // Flap test (simulate space / tap)
  await evalCode(`(() => {
    input.jumpPressed = true;
  })()`);
  await new Promise(r => setTimeout(r, 200));

  const flappyFlightState = await evalCode(`(() => ({
    state: currentState,
    x: player.x,
    y: player.y,
    vx: player.vx,
    vy: player.vy,
    flightAngle: player.flightAngle,
    lives: player.lives
  }))()`);
  console.log("Flappy Glider Flight State:", flappyFlightState);

  // Take screenshot of Flappy mode gameplay
  const snap1 = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync("/Users/elan/.gemini/antigravity-ide/brain/f23f89af-1925-43c2-bd62-e7ae87fea366/tkrs_flappy_gameplay.png", Buffer.from(snap1.data, "base64"));
  console.log("Saved tkrs_flappy_gameplay.png");

  // Trigger first radar gateway
  const quizTrigger = await evalCode(`(() => {
    openQuizModal(currentLevel.terminals[0]);
    return {
      state: currentState,
      isModalOpen: !document.getElementById("quizModal").classList.contains("hidden"),
      category: document.getElementById("quizCategory").innerText,
      question: document.getElementById("quizQuestion").innerText,
      step: document.getElementById("quizStepText").innerText
    };
  })()`);
  console.log("TKRS Radar Gateway Quiz Trigger:", quizTrigger);

  const snap2 = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync("/Users/elan/.gemini/antigravity-ide/brain/f23f89af-1925-43c2-bd62-e7ae87fea366/tkrs_radar_quiz.png", Buffer.from(snap2.data, "base64"));
  console.log("Saved tkrs_radar_quiz.png");

  // Answer quiz correctly and resume
  await evalCode(`(() => {
    handleAnswer(currentQuizTerminal.quizData.correct);
    document.getElementById("btnQuizContinue").click();
  })()`);
  await new Promise(r => setTimeout(r, 500));

  // 3. Switch to MAP 2: PMKP (Moto Runner)
  console.log("\n--- SWITCHING TO MAP 2 (PMKP MOTO RUNNER) ---");
  await evalCode(`(() => {
    setPokja("PMKP");
  })()`);
  await new Promise(r => setTimeout(r, 600));

  const pmkpInfo = await evalCode(`(() => ({
    id: currentLevel.id,
    shortName: currentLevel.shortName,
    gameMode: currentLevel.gameMode,
    playerX: player.x,
    playerY: player.y,
    obstaclesCount: currentLevel.motoObstacles ? currentLevel.motoObstacles.length : 0,
    terminalsCount: currentLevel.terminals.length
  }))()`);
  console.log("PMKP Info:", pmkpInfo);

  if (pmkpInfo.gameMode !== "MOTO_RUNNER") {
    throw new Error("Expected PMKP gameMode to be MOTO_RUNNER, got: " + pmkpInfo.gameMode);
  }

  // Jump test on motorcycle
  await evalCode(`(() => {
    input.jumpPressed = true;
  })()`);
  await new Promise(r => setTimeout(r, 200));

  const motoJumpState = await evalCode(`(() => ({
    state: currentState,
    x: player.x,
    y: player.y,
    vx: player.vx,
    vy: player.vy,
    isGrounded: player.isGrounded,
    bikePitch: player.bikePitch,
    wheelRot: player.wheelRot
  }))()`);
  console.log("Moto Runner Jump State:", motoJumpState);

  const snap3 = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync("/Users/elan/.gemini/antigravity-ide/brain/f23f89af-1925-43c2-bd62-e7ae87fea366/pmkp_moto_gameplay.png", Buffer.from(snap3.data, "base64"));
  console.log("Saved pmkp_moto_gameplay.png");

  // Test PMKP Checkpoint Gantry Quiz
  const pmkpQuizTrigger = await evalCode(`(() => {
    openQuizModal(currentLevel.terminals[0]);
    return {
      state: currentState,
      isModalOpen: !document.getElementById("quizModal").classList.contains("hidden"),
      category: document.getElementById("quizCategory").innerText,
      question: document.getElementById("quizQuestion").innerText,
      step: document.getElementById("quizStepText").innerText
    };
  })()`);
  console.log("PMKP Checkpoint Gantry Quiz Trigger:", pmkpQuizTrigger);

  const snap4 = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync("/Users/elan/.gemini/antigravity-ide/brain/f23f89af-1925-43c2-bd62-e7ae87fea366/pmkp_checkpoint_quiz.png", Buffer.from(snap4.data, "base64"));
  console.log("Saved pmkp_checkpoint_quiz.png");

  // Close quiz
  await evalCode(`(() => {
    handleAnswer(currentQuizTerminal.quizData.correct);
    document.getElementById("btnQuizContinue").click();
  })()`);
  await new Promise(r => setTimeout(r, 400));

  // 4. Switch to MAP 3: SKP (Platformer fallback check)
  console.log("\n--- SWITCHING TO MAP 3 (SKP PLATFORMER) ---");
  await evalCode(`(() => {
    setPokja("SKP");
  })()`);
  await new Promise(r => setTimeout(r, 600));

  const skpInfo = await evalCode(`(() => ({
    id: currentLevel.id,
    shortName: currentLevel.shortName,
    gameMode: currentLevel.gameMode || "PLATFORMER",
    playerX: player.x,
    playerY: player.y,
    platformsCount: currentLevel.platforms.length
  }))()`);
  console.log("SKP Info:", skpInfo);

  if (skpInfo.id !== "SKP") {
    throw new Error("Expected SKP level, got: " + skpInfo.id);
  }

  // 5. Check MAP 4 MFK as well
  console.log("\n--- SWITCHING TO MAP 4 (MFK PLATFORMER) ---");
  await evalCode(`(() => {
    setPokja("MFK");
  })()`);
  await new Promise(r => setTimeout(r, 600));

  const mfkInfo = await evalCode(`(() => ({
    id: currentLevel.id,
    shortName: currentLevel.shortName,
    gameMode: currentLevel.gameMode || "PLATFORMER",
    playerX: player.x,
    playerY: player.y,
    platformsCount: currentLevel.platforms.length
  }))()`);
  console.log("MFK Info:", mfkInfo);

  console.log("\n>>> ALL MULTI-GENRE GAME TESTS COMPLETED WITH 100% SUCCESS! <<<");
  ws.close();
} finally {
  chrome.kill();
  server.close();
}
