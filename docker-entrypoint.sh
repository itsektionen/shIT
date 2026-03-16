#!/bin/bash

set -e

bun run db:migrate
echo ""
bun run build/index.js
