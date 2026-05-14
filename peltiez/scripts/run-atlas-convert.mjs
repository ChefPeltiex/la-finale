import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { convertScansToLiveSheets } from "../server/convertScansToLiveSheets.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.server") });

const result = await convertScansToLiveSheets({ reset: true });
console.log("[atlas:convert]", result);
