const processStartTimeSeconds = Date.now() / 1000;

const requestCounters = new Map();
const requestDurationSums = new Map();
const requestDurationCounts = new Map();

const formatLabels = (labels) => Object.entries(labels)
  .map(([key, value]) => `${key}="${String(value).replace(/"/g, '\\"')}"`)
  .join(",");

const observeRequest = ({ method, route, statusCode, durationSeconds }) => {
  const labels = {
    method: method.toUpperCase(),
    route,
    status_code: String(statusCode),
  };
  const labelsKey = JSON.stringify(labels);

  requestCounters.set(labelsKey, (requestCounters.get(labelsKey) || 0) + 1);
  requestDurationSums.set(labelsKey, (requestDurationSums.get(labelsKey) || 0) + durationSeconds);
  requestDurationCounts.set(labelsKey, (requestDurationCounts.get(labelsKey) || 0) + 1);
};

const normalizeRoute = (req) => {
  if (req.route && req.route.path) {
    return `${req.baseUrl || ""}${req.route.path}`;
  }
  return req.baseUrl || req.path || "unknown";
};

const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const durationSeconds = Number(end - start) / 1e9;
    observeRequest({
      method: req.method,
      route: normalizeRoute(req),
      statusCode: res.statusCode,
      durationSeconds,
    });
  });

  next();
};

const buildMetricsBody = () => {
  const lines = [];

  lines.push("# HELP process_uptime_seconds Process uptime in seconds.");
  lines.push("# TYPE process_uptime_seconds gauge");
  lines.push(`process_uptime_seconds ${process.uptime()}`);

  lines.push("# HELP process_start_time_seconds Start time of the process since unix epoch in seconds.");
  lines.push("# TYPE process_start_time_seconds gauge");
  lines.push(`process_start_time_seconds ${processStartTimeSeconds}`);

  lines.push("# HELP nodejs_heap_used_bytes Process heap used in bytes.");
  lines.push("# TYPE nodejs_heap_used_bytes gauge");
  lines.push(`nodejs_heap_used_bytes ${process.memoryUsage().heapUsed}`);

  lines.push("# HELP http_requests_total Total number of HTTP requests.");
  lines.push("# TYPE http_requests_total counter");
  for (const [labelsKey, value] of requestCounters.entries()) {
    const labels = JSON.parse(labelsKey);
    lines.push(`http_requests_total{${formatLabels(labels)}} ${value}`);
  }

  lines.push("# HELP http_request_duration_seconds_sum Total accumulated request duration in seconds.");
  lines.push("# TYPE http_request_duration_seconds_sum counter");
  for (const [labelsKey, value] of requestDurationSums.entries()) {
    const labels = JSON.parse(labelsKey);
    lines.push(`http_request_duration_seconds_sum{${formatLabels(labels)}} ${value}`);
  }

  lines.push("# HELP http_request_duration_seconds_count Total number of observed request durations.");
  lines.push("# TYPE http_request_duration_seconds_count counter");
  for (const [labelsKey, value] of requestDurationCounts.entries()) {
    const labels = JSON.parse(labelsKey);
    lines.push(`http_request_duration_seconds_count{${formatLabels(labels)}} ${value}`);
  }

  return `${lines.join("\n")}\n`;
};

const metricsHandler = (req, res) => {
  res.set("Content-Type", "text/plain; version=0.0.4");
  res.send(buildMetricsBody());
};

module.exports = {
  metricsMiddleware,
  metricsHandler,
};
