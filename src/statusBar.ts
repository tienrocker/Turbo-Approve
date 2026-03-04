import * as vscode from "vscode";
import { TurboConfig } from "./config";

export class StatusBarManager implements vscode.Disposable {
  private statusBarItem: vscode.StatusBarItem;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      1000,
    );
    this.statusBarItem.command = "turboApprove.toggle";
    this.statusBarItem.show();
  }

  update(config: TurboConfig): void {
    if (config.enabled) {
      this.statusBarItem.text = "$(rocket) Turbo: ON";
      this.statusBarItem.backgroundColor = new vscode.ThemeColor(
        "statusBarItem.warningBackground",
      );
      this.statusBarItem.tooltip = this.buildTooltip(config);
      this.statusBarItem.color = undefined;
    } else {
      this.statusBarItem.text = "$(circle-slash) Turbo: OFF";
      this.statusBarItem.backgroundColor = undefined;
      this.statusBarItem.tooltip = "Click to enable Turbo Approve";
      this.statusBarItem.color = new vscode.ThemeColor("statusBar.foreground");
    }
  }

  private buildTooltip(config: TurboConfig): vscode.MarkdownString {
    const md = new vscode.MarkdownString();
    md.isTrusted = true;
    md.supportThemeIcons = true;

    md.appendMarkdown("### $(rocket) Turbo Approve — Active\n\n");
    md.appendMarkdown(`| Feature | Status |\n`);
    md.appendMarkdown(`|---------|--------|\n`);
    md.appendMarkdown(
      `| Auto-Scroll | ${config.autoScroll ? "$(check) ON" : "$(x) OFF"} |\n`,
    );
    md.appendMarkdown(
      `| Auto-Approve | ${config.autoApprove ? "$(check) ON" : "$(x) OFF"} |\n`,
    );
    md.appendMarkdown(`| Approve Delay | ${config.approveDelay}ms |\n`);
    md.appendMarkdown(
      `| Notifications | ${config.showNotifications ? "$(check) ON" : "$(x) OFF"} |\n`,
    );
    md.appendMarkdown("\n---\n");
    md.appendMarkdown("$(info) Click to toggle • `Ctrl+Shift+T`\n");

    return md;
  }

  flash(message: string): void {
    const original = this.statusBarItem.text;
    this.statusBarItem.text = message;
    setTimeout(() => {
      this.statusBarItem.text = original;
    }, 2000);
  }

  dispose(): void {
    this.statusBarItem.dispose();
  }
}
