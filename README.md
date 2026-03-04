# 🚀 Turbo Approve

[![Version](https://img.shields.io/visual-studio-marketplace/v/vgplay.turbo-approve)](https://marketplace.visualstudio.com/items?itemName=vgplay.turbo-approve)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/vgplay.turbo-approve)](https://marketplace.visualstudio.com/items?itemName=vgplay.turbo-approve)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/vgplay.turbo-approve)](https://marketplace.visualstudio.com/items?itemName=vgplay.turbo-approve)
[![License](https://img.shields.io/github/license/vgplay/turbo-approve)](LICENSE)

**Auto-scroll and auto-approve for AI coding assistants.** Stop clicking "Approve" a hundred times a day — let Turbo Approve handle it for you.

> Works with Antigravity IDE, Cursor, VS Code + Copilot, and other AI-powered editors.

---

## ✨ Features

| Feature                    | Description                                                       |
| -------------------------- | ----------------------------------------------------------------- |
| 🔄 **Auto-Scroll**         | Automatically scrolls editors and terminals to the latest content |
| ✅ **Auto-Approve**        | Instantly approves AI-suggested commands, edits, and actions      |
| ⚡ **One-Click Toggle**    | Status bar button to enable/disable with a single click           |
| ⏱️ **Configurable Delay**  | Set a delay before auto-approving for safety                      |
| 🔔 **Smart Notifications** | Non-intrusive status bar notifications on each approval           |
| ⌨️ **Keyboard Shortcut**   | Toggle with `Ctrl+Shift+T` (`Cmd+Shift+T` on Mac)                 |
| ⚙️ **Granular Settings**   | Independent toggles for auto-scroll and auto-approve              |

---

## 🎯 Quick Start

1. Install the extension
2. Click `$(circle-slash) Turbo: OFF` in the status bar → it becomes `$(rocket) Turbo: ON`
3. That's it — sit back and let Turbo handle approvals and scrolling!

> **Tip:** Use `Ctrl+Shift+T` to toggle quickly without clicking.

---

## ⚙️ Settings

Open **Settings** → search `Turbo Approve`:

| Setting                          | Default | Description                       |
| -------------------------------- | ------- | --------------------------------- |
| `turboApprove.enabled`           | `false` | Master toggle                     |
| `turboApprove.autoScroll`        | `true`  | Auto-scroll editors and terminals |
| `turboApprove.autoApprove`       | `true`  | Auto-approve AI actions           |
| `turboApprove.approveDelay`      | `500`   | Delay in ms before auto-approval  |
| `turboApprove.showNotifications` | `true`  | Show status bar notifications     |
| `turboApprove.scrollDebounce`    | `150`   | Scroll debounce interval in ms    |

---

## 🎹 Commands

Open Command Palette (`Ctrl+Shift+P`) and type `Turbo`:

| Command                              | Description                |
| ------------------------------------ | -------------------------- |
| `Turbo Approve: Toggle On/Off`       | Master toggle              |
| `Turbo Approve: Toggle Auto-Scroll`  | Toggle auto-scroll only    |
| `Turbo Approve: Toggle Auto-Approve` | Toggle auto-approve only   |
| `Turbo Approve: Show Status`         | View current configuration |

---

## 🔐 Safety

- **Off by default** — You must explicitly enable Turbo Approve
- **Configurable delay** — Add a delay before auto-approval to review actions
- **Granular control** — Enable auto-scroll without auto-approve, or vice versa
- **Quick kill switch** — Click the status bar or press `Ctrl+Shift+T` to instantly disable

---

## 🛠️ Development

```bash
# Clone and install
git clone https://github.com/vgplay/turbo-approve.git
cd turbo-approve
npm install

# Development
npm run watch     # Watch mode with auto-rebuild
npm run compile   # One-time build
npm run lint      # Run linter

# Package
npm run package   # Create .vsix file
```

---

## 📦 CI/CD

This project uses GitHub Actions for automated publishing:

- **CI** → Runs on every push and PR (lint + compile)
- **Publish** → Triggered by version tags (`v*`) → publishes to VS Code Marketplace + Open VSX

```bash
# To release a new version:
npm version patch   # or minor / major
git push --tags
```

---

## 📝 License

[MIT](LICENSE) © VGPlay

---

<p align="center">
  Made with ❤️ for developers who click "Approve" too many times
</p>
