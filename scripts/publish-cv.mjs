import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { curateToFile } from "./curate-public-cv.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function run(cmd) {
  execSync(cmd, { cwd: root, stdio: "inherit", env: process.env });
}

function git(cmd) {
  return execSync(`git ${cmd}`, { cwd: root, encoding: "utf8" }).trim();
}

async function triggerVercelHook() {
  const hook = process.env.VERCEL_DEPLOY_HOOK;
  if (!hook) return;
  const res = await fetch(hook, { method: "POST" });
  if (!res.ok) {
    throw new Error(`Vercel deploy hook failed: ${res.status}`);
  }
  console.log("[publish] Vercel deploy hook triggered.");
}

async function main() {
  const { dest } = await curateToFile();

  const autoPush = process.env.CV_AUTO_PUSH !== "0";
  const autoCommit = process.env.CV_AUTO_COMMIT !== "0";

  if (!autoCommit) {
    console.log(`[publish] Wrote ${dest} (commit/push disabled).`);
    return;
  }

  run("git add src/content/cv.generated.json");

  try {
    git('diff --cached --quiet');
    console.log("[publish] No changes to publish.");
    return;
  } catch {
    // has changes
  }

  const msg = process.env.CV_COMMIT_MESSAGE ?? "chore(cv): sync public CV from job hunter";
  run(
    `git -c user.name="${process.env.CV_GIT_NAME ?? "CV Bot"}" -c user.email="${process.env.CV_GIT_EMAIL ?? "vadymalyekseyenko@gmail.com"}" commit -m "${msg.replace(/"/g, '\\"')}"`,
  );

  if (autoPush) {
    const branch = process.env.CV_GIT_BRANCH ?? "main";
    run(`git push origin ${branch}`);
    console.log(`[publish] Pushed to origin/${branch}. Vercel will rebuild.`);
  }

  await triggerVercelHook();
}

main().catch((err) => {
  console.error("[publish] Failed:", err.message);
  process.exit(1);
});
