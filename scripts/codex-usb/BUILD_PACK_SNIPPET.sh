# Optional two-line hook for build_pack.sh (comments only — not meant to be executed).
#
#   ROOT_HOOK="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
#   python3 "$ROOT_HOOK/scripts/codex-usb/validator_full.py" || exit 1
#
# Adjust ROOT_HOOK if build_pack.sh is not next to the repo/pack root that contains scripts/codex-usb.
