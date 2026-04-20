#!/bin/bash
# Post-tool-use hook — warns when a .vue file is created without a test
# Register in .claude/settings.json:
# "hooks": { "PostToolUse": [{ "matcher": ".*", "hooks": [{ "type": "command", "command": ".claude/hooks/require-test.sh" }] }] }

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('path',''))" 2>/dev/null || echo "")

if [[ ! "$FILE_PATH" =~ src/modules/.+/components/.+\.vue$ ]]; then
  exit 0
fi

MODULE_DIR=$(echo "$FILE_PATH" | grep -oP 'src/modules/[^/]+')
COMPONENT_NAME=$(basename "$FILE_PATH" .vue)
EXPECTED_TEST="$MODULE_DIR/__tests__/$COMPONENT_NAME.spec.ts"

if [[ ! -f "$EXPECTED_TEST" ]]; then
  echo "WARNING: Missing test for $COMPONENT_NAME"
  echo "Expected: $EXPECTED_TEST"
  echo "Generate it with: /project:new-component $COMPONENT_NAME"
fi

exit 0