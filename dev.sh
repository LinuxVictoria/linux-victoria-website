#!/bin/bash
set -e

IMAGE="luv-website-dev"
CONTAINER="luv-website"

# Remove old container if it exists
podman rm -f "$CONTAINER" 2>/dev/null || true

# Build image
podman build -t "$IMAGE" -f Containerfile .

# Run with source mounted for hot-reload, excluding node_modules
podman run --rm --name "$CONTAINER" \
  -p 8080:8080 \
  -v "$(pwd)/src:/app/src:z" \
  -v "$(pwd)/package.json:/app/package.json:z" \
  "$IMAGE"
