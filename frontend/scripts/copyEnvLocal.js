const fs = require("fs");
const path = require("path");

const frontendRoot = path.join(__dirname, "..");
const src = path.join(frontendRoot, ".env.local.example");
const dest = path.join(frontendRoot, ".env.local");

try {
  if (!fs.existsSync(src)) {
    console.error(
      "Source .env.local.example not found — please create one in the frontend folder",
    );
    process.exit(1);
  }

  if (fs.existsSync(dest)) {
    console.log(".env.local already exists — skipping copy");
    process.exit(0);
  }

  fs.copyFileSync(src, dest);
  console.log("✅ Created frontend/.env.local from .env.local.example");
  process.exit(0);
} catch (err) {
  console.error("Failed to copy .env.local.example:", err.message);
  process.exit(1);
}
