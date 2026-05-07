const express = require("express");
const cors = require("cors");

const notesRoutes = require("./routes/notes.routes");
const tasksRoutes = require("./routes/tasks.routes");
const ideasRoutes = require("./routes/ideas.routes");
const linksRoutes = require("./routes/links.routes");
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/error.handler");
const { metricsMiddleware, metricsHandler } = require("./monitoring/metrics");

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);
app.use(metricsMiddleware);

// routes
app.use("/notes", notesRoutes);
app.use("/tasks", tasksRoutes);
app.use("/ideas", ideasRoutes);
app.use("/links", linksRoutes);
app.get("/metrics", metricsHandler);

app.use(errorHandler);

module.exports = app;