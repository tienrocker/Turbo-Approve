import * as vscode from "vscode";
import { Logger } from "./logger";

export class AutoScroller implements vscode.Disposable {
  private disposables: vscode.Disposable[] = [];
  private enabled = false;
  private debounceTimer: ReturnType<typeof setTimeout> | undefined;
  private debounceMs = 150;

  constructor(private readonly logger: Logger) {}

  start(debounceMs: number): void {
    if (this.enabled) {
      return;
    }
    this.enabled = true;
    this.debounceMs = debounceMs;

    // Auto-scroll when text document content changes
    this.disposables.push(
      vscode.workspace.onDidChangeTextDocument((e) => {
        if (!this.enabled) {
          return;
        }
        this.debouncedScrollToBottom(e.document);
      }),
    );

    // Auto-scroll when active editor changes
    this.disposables.push(
      vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (!this.enabled || !editor) {
          return;
        }
        this.scrollEditorToBottom(editor);
      }),
    );

    // Auto-scroll terminals
    this.disposables.push(
      vscode.window.onDidChangeActiveTerminal(() => {
        if (!this.enabled) {
          return;
        }
        // Terminal scrolling is handled by sending a command
        this.scrollTerminalToBottom();
      }),
    );

    // Auto-scroll when terminal output changes (via terminal state change)
    this.disposables.push(
      vscode.window.onDidChangeTerminalState(() => {
        if (!this.enabled) {
          return;
        }
        this.scrollTerminalToBottom();
      }),
    );

    this.logger.info("AutoScroller started");
  }

  stop(): void {
    this.enabled = false;
    this.clearDebounce();
    this.disposeListeners();
    this.logger.info("AutoScroller stopped");
  }

  updateDebounce(ms: number): void {
    this.debounceMs = ms;
  }

  private debouncedScrollToBottom(document: vscode.TextDocument): void {
    this.clearDebounce();
    this.debounceTimer = setTimeout(() => {
      const editor = vscode.window.visibleTextEditors.find(
        (e) => e.document === document,
      );
      if (editor) {
        this.scrollEditorToBottom(editor);
      }
    }, this.debounceMs);
  }

  private scrollEditorToBottom(editor: vscode.TextEditor): void {
    try {
      const lastLine = editor.document.lineCount - 1;
      const range = new vscode.Range(lastLine, 0, lastLine, 0);
      editor.revealRange(range, vscode.TextEditorRevealType.Default);
    } catch (err) {
      this.logger.error("Failed to scroll editor", err as Error);
    }
  }

  private scrollTerminalToBottom(): void {
    try {
      // Use built-in command to scroll terminal to bottom
      vscode.commands.executeCommand(
        "workbench.action.terminal.scrollToBottom",
      );
    } catch (err) {
      this.logger.error("Failed to scroll terminal", err as Error);
    }
  }

  private clearDebounce(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = undefined;
    }
  }

  private disposeListeners(): void {
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
  }

  dispose(): void {
    this.stop();
  }
}
