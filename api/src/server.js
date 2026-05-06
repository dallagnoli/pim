const app = require("./app");
const pool = require("./db/pool");

const PORT = 3000;

const waitForDb = async () => {
  const maxAttempts = 10;
  const delayMs = 1000;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await pool.query("SELECT 1");
      return;
    } catch (error) {
      console.log(`Waiting for database (${attempt}/${maxAttempts})...`);
      if (attempt === maxAttempts) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
};

(async () => {
  try {
    await waitForDb();
    app.listen(PORT, () => {
      console.log(`Personal Information Manager running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error.message || error);
    process.exit(1);
  }
})();