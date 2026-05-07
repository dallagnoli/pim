# Monitoring with Prometheus and Grafana

This project exposes Prometheus-compatible metrics in the API and includes Prometheus + Grafana services in Docker Compose.

## 1) Start the stack

1. Configure your `.env` using `.env.example`.
2. Start everything:

```bash
docker compose up --build
```

## 2) Validate metrics endpoint

API metrics endpoint:

- `http://localhost:3000/metrics`

You should see metrics such as:

- `http_requests_total`
- `http_request_duration_seconds_sum`
- `http_request_duration_seconds_count`
- `process_uptime_seconds`

## 3) Open Prometheus

- URL: `http://localhost:9090`
- Example query:
  - `http_requests_total`
  - `rate(http_requests_total[1m])`

## 4) Open Grafana

- URL: `http://localhost:3001`
- Default login:
  - user: `admin`
  - password: `admin`

Prometheus is auto-provisioned as a datasource (`http://prometheus:9090` from inside the Docker network).
An initial dashboard called `PIM API Overview` is auto-provisioned too.

## 5) Build your first dashboard

In Grafana:

1. Create Dashboard -> Add visualization.
2. Select metric `rate(http_requests_total[1m])`.
3. Group by labels (for example by `route` or `status_code`).

Preloaded dashboard panels:

- Requests per second
- Average latency
- Requests per second by route
- Node.js heap used

Useful starter queries:

- Requests per second:
  - `sum(rate(http_requests_total[1m]))`
- Requests by route:
  - `sum by (route) (rate(http_requests_total[1m]))`
- Average latency (seconds):
  - `sum(rate(http_request_duration_seconds_sum[1m])) / sum(rate(http_request_duration_seconds_count[1m]))`

## Notes

- The API metrics are implemented without external metric libraries to keep setup simple and avoid extra package installation requirements.
- If you later want richer default Node.js metrics (GC, event loop, file descriptors), migrate this implementation to `prom-client`.
