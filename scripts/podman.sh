#!/usr/bin/env bash
set -euo pipefail

IMAGE="linux-victoria-website"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

usage() {
  cat <<EOF
Usage: scripts/podman.sh <command> [options]

Commands:
  dev [port]  Build image and run the dev server on port (default: 8080).
              Exits with an error if the port is already in use.
  build       Run the production build inside a container.
              Output is written to _site/ on the host.
  shell       Open a shell inside the container for debugging.
EOF
}

build_image() {
  podman build -t "$IMAGE" -f "$ROOT/Containerfile" "$ROOT"
}

case "${1:-}" in
  dev)
    PORT="${2:-8080}"
    if ss -tlnH "sport = :$PORT" 2>/dev/null | grep -q .; then
      echo "Error: port $PORT is already in use." >&2
      echo "Try: scripts/podman.sh dev <port>" >&2
      exit 1
    fi
    build_image
    podman run --rm -it \
      -p "$PORT:8080" \
      -v "$ROOT:/app:z" \
      -v /app/node_modules \
      "$IMAGE" npm start
    ;;
  build)
    build_image
    podman run --rm \
      -v "$ROOT:/app:z" \
      "$IMAGE" npm run build
    ;;
  shell)
    build_image
    podman run --rm -it \
      -v "$ROOT:/app:z" \
      "$IMAGE" sh
    ;;
  *)
    usage
    ;;
esac
