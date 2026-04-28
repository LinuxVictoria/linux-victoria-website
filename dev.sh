#!/bin/bash
set -e

PORT="${1:-8080}"
IMAGE="luv-website-dev"
CONTAINER="luv-website"

podman rm -f "$CONTAINER" 2>/dev/null || true

podman build -t "$IMAGE" -f Containerfile .

podman run --rm --name "$CONTAINER" \
  -p "${PORT}:8080" \
  -v "$(pwd)/src:/app/src:z" \
  -v "$(pwd)/package.json:/app/package.json:z" \
  "$IMAGE"
