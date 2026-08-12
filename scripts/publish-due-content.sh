#!/usr/bin/env bash
# Cron entrypoint for the SEO content publishing dispatcher.
# Invoked every 5 minutes; the dispatcher itself decides whether anything is due.
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${script_dir}/.."

node scripts/content-pipeline/dispatcher.mjs "$@"
