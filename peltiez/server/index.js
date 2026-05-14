import dotenv from "dotenv";
import { createSovereignApp } from "./sovereignApp.js";

dotenv.config({ path: ".env.server" });

const port = Number(process.env.PORT || 8787);
const app = createSovereignApp(process.env);

app.listen(port, () => {
  console.log(`IGOR sovereign core listening on http://localhost:${port}`);
});
