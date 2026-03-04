import * as vscode from 'vscode';
import { Logger } from './logger';

/**
 * AutoApprover monitors for approval prompts from AI coding assistants
 * and automatically approves them after a configurable delay.
 *
 * It works by:
 * 1. Intercepting known approval commands from various AI assistants
 * 2. Watching for interactive terminal prompts that need approval
 * 3. Executing approval commands automatically with a delay
 */
export class AutoApprover implements vscode.Disposable {
  private disposables: vscode.Disposable[] = [];
  private enabled = false;
  private delayMs = 500;
  private showNotifications = true;
  private pendingTimers: ReturnType<typeof setTimeout>[] = [];
  private approveCount = 0;

  // Known approval-related commands from various AI assistants
  private static readonly APPROVE_COMMANDS = [
    // Antigravity IDE
    'antigravity.approve',
    'antigravity.approveAll',
    'antigravity.acceptSuggestion',
    'antigravity.approveCommand',
    'antigravity.approveAndRun',
    // Generic / common patterns
    'workbench.action.acceptSelectedSuggestion',
    'editor.action.inlineSuggest.commit',
    // Cursor-like
    'cursor.acceptSuggestion',
    'cursor.approveCommand',
    // Copilot
    'github.copilot.acceptSuggestion',
    'github.copilot.acceptCursorPanelSolution',
  ];

  constructor(private readonly logger: Logger) {}

  start(delayMs: number, showNotifications: boolean): void {
    if (this.enabled) {
      return;
    }
    this.enabled = true;
    this.delayMs = delayMs;
    this.showNotifications = showNotifications;
    this.approveCount = 0;

    // Watch for dialogs / quick input that might be approval prompts
    this.disposables.push(
      vscode.window.onDidChangeWindowState(() => {
        if (!this.enabled) {
          return;
        }
        this.tryAutoApprove();
      }),
    );

    // Poll for approve buttons periodically
    this.startPolling();

    this.logger.info(`AutoApprover started (delay: ${this.delayMs}ms)`);
  }

  stop(): void {
    this.enabled = false;
    this.clearPendingTimers();
    this.disposeListeners();
    this.logger.info(
      `AutoApprover stopped (approved ${this.approveCount} actions)`,
    );
  }

  updateConfig(delayMs: number, showNotifications: boolean): void {
    this.delayMs = delayMs;
    this.showNotifications = showNotifications;
  }

  private startPolling(): void {
    const pollInterval = setInterval(() => {
      if (!this.enabled) {
        clearInterval(pollInterval);
        return;
      }
      this.tryAutoApprove();
    }, 1000);

    this.disposables.push({
      dispose: () => clearInterval(pollInterval),
    });
  }

  private tryAutoApprove(): void {
    if (!this.enabled) {
      return;
    }

    // Try to execute known approval commands
    for (const command of AutoApprover.APPROVE_COMMANDS) {
      this.scheduleApproval(command);
    }
  }

  private scheduleApproval(command: string): void {
    const timer = setTimeout(async () => {
      if (!this.enabled) {
        return;
      }

      try {
        await vscode.commands.executeCommand(command);
        this.approveCount++;
        this.logger.info(`Auto-approved: ${command}`);

        if (this.showNotifications) {
          // Use status bar message instead of modal notification to be less intrusive
          vscode.window.setStatusBarMessage(
            '$(check) Turbo: Auto-approved',
            2000,
          );
        }
      } catch {
        // Command not available or failed — this is expected for most commands
        // since we try all known patterns
      }

      // Remove timer from pending list
      const idx = this.pendingTimers.indexOf(timer);
      if (idx !== -1) {
        this.pendingTimers.splice(idx, 1);
      }
    }, this.delayMs);

    this.pendingTimers.push(timer);
  }

  private clearPendingTimers(): void {
    this.pendingTimers.forEach((t) => clearTimeout(t));
    this.pendingTimers = [];
  }

  private disposeListeners(): void {
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
  }

  getApproveCount(): number {
    return this.approveCount;
  }

  dispose(): void {
    this.stop();
  }
}
