const helmet = require("helmet");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./modules/auth/routes/auth.routes");
const studentRoutes = require("./modules/student/routes/student.routes");
const documentRoutes = require("./modules/document/routes/document.routes");
const admissionRoutes = require("./modules/admission/routes/admission.routes");

const app = express();

app.use(helmet());

/*
| Global Middleware
*/

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
| Health Check
*/

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "University ERP Backend Running",
  });
});

/*
| API Routes
*/

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/document", documentRoutes);
app.use("/api/admission", admissionRoutes);

/*
| 404 Handler
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/*
| Global Error Handler
*/

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
