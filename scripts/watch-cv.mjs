import { watch } from "node:fs";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const sourcePath =
  process.env.CV_SOURCE ??
  "C:\\Users\\habit\\Desktop\\linked - Cópia (4) - Cópia\\backend\\user_cv.json";

const knowledgePath =
  process.env.CV_KNOWLEDGE_SOURCE ??
  "C:\\Users\\habit\\Desktop\\linked - Cópia (4) - Cópia\\backend\\knowledge_base.json";

const debounceMs = Number(process.env.CV_WATCH_DEBOUNCE_MS ?? 4000);
let timer = null;
let running = false;

function schedule(reason) {
  clearTimeout(timer);
  timer = setTimeout(() => runPublish(reason), debounceMs);
}

function runPublish(reason) {
  if (running) {
    schedule(`${reason} (queued)`);
    return;
  }
  running = true;
  console.log(`[watch] Change detected (${reason}). Publishing…`);

  const child = spawn(process.execPath, [join(__dirname, "publish-cv.mjs")], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, CV_USE_NEURAL: process.env.CV_USE_NEURAL ?? "1" },
  });

  child.on("exit", (code) => {
    running = false;
    if (code !== 0) {
      console.error(`[watch] publish-cv exited with code ${code}`);
    }
  });
}

function watchFile(path, label) {
  if (!existsSync(path)) {
    console.warn(`[watch] Missing ${label}: ${path}`);
    return;
  }
  watch(path, { persistent: true }, (event) => {
    if (event === "change") schedule(label);
  });
  console.log(`[watch] Watching ${label}: ${path}`);
}

console.log("[watch] CV auto-publish watcher started.");
watchFile(sourcePath, "user_cv.json");
watchFile(knowledgePath, "knowledge_base.json");
