import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildPublicCv } from "./lib/curate-public.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const sourcePath =
  process.env.CV_SOURCE ??
  "C:\\Users\\habit\\Desktop\\linked - Cópia (4) - Cópia\\backend\\user_cv.json";

const neuralUrl = process.env.CV_NEURAL_URL ?? "http://localhost:3004/api/cv/neural";

async function loadRawCv() {
  if (process.env.CV_USE_NEURAL === "1") {
    try {
      const res = await fetch(neuralUrl, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const data = await res.json();
        if (data?.profile) {
          console.log(`[curate] Loaded profile from ${neuralUrl}`);
          return data.profile;
        }
      }
    } catch (err) {
      console.warn(`[curate] Neural API unavailable (${err.message}), using file.`);
    }
  }

  const raw = JSON.parse(readFileSync(sourcePath, "utf8"));
  console.log(`[curate] Loaded ${sourcePath}`);
  return raw;
}

export async function curateToFile() {
  const raw = await loadRawCv();
  const publicCv = buildPublicCv(raw);
  const dest = join(root, "src", "content", "cv.generated.json");
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, `${JSON.stringify(publicCv, null, 2)}\n`, "utf8");
  return { dest, publicCv };
}

const isMain =
  process.argv[1] &&
  resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));

if (isMain) {
  curateToFile()
    .then(({ dest }) => console.log(`Wrote ${dest}`))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
