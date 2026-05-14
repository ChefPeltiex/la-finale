/**
 * Orchestration Node — lance simulate_time_noise.py avec --out (sortie JSON compacte sur stdout).
 * Usage (depuis la racine egor-time-sim) :
 *   node node_pipeline/analyze.js [chemin/config.json]
 */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const py = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
const configPath = path.resolve(root, process.argv[2] || "config.example.json");
const outJson = path.join(root, "results", "last_result.json");
const scriptPath = path.join(root, "simulate_time_noise.py");

function main() {
  if (!fs.existsSync(configPath)) {
    console.error("Config introuvable:", configPath);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(outJson), { recursive: true });

  const res = spawnSync(
    py,
    [scriptPath, "--config", configPath, "--out", outJson],
    { encoding: "utf8", cwd: root, env: { ...process.env, PYTHONUTF8: "1" } },
  );
  if (res.error) {
    console.error(res.error);
    process.exit(1);
  }
  if (res.status !== 0) {
    console.error(res.stderr || res.stdout);
    process.exit(res.status ?? 1);
  }

  const meta = JSON.parse(res.stdout);
  const full = JSON.parse(fs.readFileSync(outJson, "utf8"));
  console.log(
    JSON.stringify(
      { ok: true, meta, resultPath: outJson, allanPoints: Object.keys(full.allan_deviation || {}).length },
      null,
      2,
    ),
  );
}

main();
