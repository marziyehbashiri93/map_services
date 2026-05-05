# [Service Name]

> One-line description of what this service does and where it sits in the stack.

## Overview

Brief description covering:
- The service's role in the overall map_services architecture
- Key technology / Docker image used
- Integration points with other services

## Prerequisites

- **Docker** and **Docker Compose** (Compose plugin on Docker CLI is sufficient)
- Any Docker networks that must exist before this service starts
- Any data files or configuration that must be in place first

## Installation

```bash
# Step-by-step commands to get the service running for the first time
```

## Configuration

| Variable / File | Default | Description |
|-----------------|---------|-------------|
| `example_var`   | `value` | What it controls |

Key configuration files and where to find them.

## Usage

### Start

```bash
docker compose up -d --build
```

### Stop

```bash
docker compose down
```

### Restart / Reload (without full restart)

```bash
# e.g. nginx -s reload or equivalent
```

## Endpoints

| Endpoint | Access | Notes |
|----------|--------|-------|
| `http://host:port/path` | loopback / public | Purpose |

## Directory Structure

```text
service-name/
├── docker-compose.yml
├── Dockerfile
├── config-file
└── data/              # runtime data / volumes
```

## Troubleshooting

```bash
# Live logs
docker compose logs -f <service>

# Health status
docker inspect --format='{{json .State.Health}}' <container>

# Quick API check
curl http://127.0.0.1:<port>/health
```

## Related Documentation

- [Analysis report](../docs/analysis-report.md)
- [Implementation report](../docs/implementation-report.md)
- [HA architecture guide](../docs/ha-recommendation.md)
