require("dotenv").config({
  path: "./src/config/.env",
});

const app = require("./src/app");

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
