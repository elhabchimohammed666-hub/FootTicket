import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";

const port = Number(process.env.PORT || 5000);

try {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`FootTicket API listening on port ${port}`);
  });
} catch (error) {
  console.error("Unable to start FootTicket API:", error);
  process.exitCode = 1;
}
