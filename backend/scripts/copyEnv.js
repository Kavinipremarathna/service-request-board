const fs = require("fs");
const path = require("path");

const backendRoot = path.join(__dirname, "..");
const src = path.join(backendRoot, ".env.example");
const dest = path.join(backendRoot, ".env");

try {
  if (!fs.existsSync(src)) {
    console.error(
      "Source .env.example not found — please create one in the backend folder",
    );
    process.exit(1);
  }

  if (fs.existsSync(dest)) {
    console.log(".env already exists — skipping copy");
    process.exit(0);
  }

  fs.copyFileSync(src, dest);
  console.log("✅ Created backend/.env from .env.example");
  process.exit(0);
} catch (err) {
  console.error("Failed to copy .env.example:", err.message);
  process.exit(1);
}
