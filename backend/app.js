const express = require("express");
require("dotenv").config();

const routes = require("./routes");
const { seed } = require("./seed/sampleData");

const app = express();
app.use(express.json());
app.use("/api", routes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  console.log(`Backend listening on port ${PORT}`);
  if (process.env.SEED_DATA === "true") {
    await seed();
    console.log("Sample data loaded");
  }
});