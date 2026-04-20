#!/bin/bash
# Pre-tool-use hook — blocks cross-module boundary imports
# Register in .claude/settings.json:
# "hooks": { "PreToolUse": [{ "matcher": ".*", "hooks": [{ "type": "command", "command": ".claude/hooks/validate-imports.sh" }] }] }

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null || echo "")
CONTENT=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('content', d.get('new_content','')))" 2>/dev/null || echo "")

if [[ ! "$FILE_PATH" =~ \.(ts|vue)$ ]]; then
  exit 0
fi

CURRENT_MODULE=$(echo "$FILE_PATH" | grep -oP 'src/modules/\K[^/]+' || echo "")

if [[ -z "$CURRENT_MODULE" ]]; then
  exit 0
fi

MODULES=("auth" "doctor" "patient" "payment")
VIOLATIONS=()

for MODULE in "${MODULES[@]}"; do
  if [[ "$MODULE" == "$CURRENT_MODULE" ]]; then
    continue
  fi
  if echo "$CONTENT" | grep -qP "from ['\"].*modules/$MODULE/(composables|services|api)"; then
    VIOLATIONS+=("Importing $MODULE internals from $CURRENT_MODULE module")
  fi
done

if [[ ${#VIOLATIONS[@]} -gt 0 ]]; then
  echo "BLOCKED: DDD module boundary violation"
  for V in "${VIOLATIONS[@]}"; do
    echo "  - $V"
  done
  echo "Use window.dispatchEvent instead. See .claude/rules/events.md"
  exit 1
fi

exit 0