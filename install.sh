#!/usr/bin/env bash
#
# Git Hydra - One-line Universal Installer
# Downloads precompiled official release binary and installs to ~/.local/
#
set -euo pipefail

REPO="MarceloFullStack/git-hydra-app"
INSTALL_DIR="${HOME}/.local"

echo "🐉 Installing Git Hydra..."

ARCH=$(uname -m)
case "$ARCH" in
    x86_64)
        PKG_ARCH="amd64"
        ;;
    aarch64|arm64)
        PKG_ARCH="arm64"
        ;;
    *)
        echo "❌ Architecture $ARCH not supported by automated installer." >&2
        exit 1
        ;;
esac

echo "🔍 Fetching latest release info from GitHub ($REPO)..."
LATEST_TAG=$(curl -fsSL "https://api.github.com/repos/$REPO/releases/latest" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')

if [[ -z "$LATEST_TAG" ]]; then
    LATEST_TAG="v1.0.3"
fi

VERSION="${LATEST_TAG#v}"
TAR_NAME="git-hydra-${VERSION}-linux-${PKG_ARCH}.tar.gz"
DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${LATEST_TAG}/${TAR_NAME}"

echo "⬇️ Downloading ${TAR_NAME} (${LATEST_TAG})..."
TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

curl -fsSL "$DOWNLOAD_URL" -o "$TMP_DIR/${TAR_NAME}"

echo "📦 Extracting into ${INSTALL_DIR}..."
tar -xzf "$TMP_DIR/${TAR_NAME}" -C "$TMP_DIR"

mkdir -p "${INSTALL_DIR}/bin" "${INSTALL_DIR}/share/applications" "${INSTALL_DIR}/share/icons"

# Copy binary
cp "$TMP_DIR/usr/bin/git_hydra" "${INSTALL_DIR}/bin/git_hydra"
chmod +x "${INSTALL_DIR}/bin/git_hydra"
ln -sf "${INSTALL_DIR}/bin/git_hydra" "${INSTALL_DIR}/bin/git-hydra"

# Copy desktop launcher and icons
if [[ -d "$TMP_DIR/usr/share/applications" ]]; then
    cp -r "$TMP_DIR/usr/share/applications/." "${INSTALL_DIR}/share/applications/"
fi

if [[ -d "$TMP_DIR/usr/share/icons" ]]; then
    cp -r "$TMP_DIR/usr/share/icons/." "${INSTALL_DIR}/share/icons/"
fi

if command -v update-desktop-database >/dev/null 2>&1; then
    update-desktop-database "${INSTALL_DIR}/share/applications" 2>/dev/null || true
fi

echo ""
echo "🎉 Git Hydra ${LATEST_TAG} installed successfully!"
echo "   Run from terminal: git-hydra"
echo "   Or open 'Git Hydra' from your desktop application menu."
