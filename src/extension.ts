import * as vscode from 'vscode';
import { ConfigManager } from './config';
import { Logger } from './logger';
import { AutoScroller } from './autoScroller';
import { AutoApprover } from './autoApprover';
import { StatusBarManager } from './statusBar';

let logger: Logger;
let autoScroller: AutoScroller;
let autoApprover: AutoApprover;
let statusBar: StatusBarManager;

export function activate(context: vscode.ExtensionContext): void {
  logger = new Logger();
  autoScroller = new AutoScroller(logger);
  autoApprover = new AutoApprover(logger);
  statusBar = new StatusBarManager();

  logger.info('Turbo Approve is initializing...');

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('turboApprove.toggle', async () => {
      const newState = await ConfigManager.toggleEnabled();
      const label = newState ? 'enabled' : 'disabled';
      logger.info(`Turbo Approve ${label}`);
      vscode.window.showInformationMessage(
        `$(rocket) Turbo Approve: ${newState ? 'ON' : 'OFF'}`,
      );
      syncState();
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'turboApprove.toggleAutoScroll',
      async () => {
        const newState = await ConfigManager.toggleAutoScroll();
        logger.info(`Auto-Scroll: ${newState ? 'ON' : 'OFF'}`);
        vscode.window.showInformationMessage(
          `Turbo Approve — Auto-Scroll: ${newState ? 'ON' : 'OFF'}`,
        );
        syncState();
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'turboApprove.toggleAutoApprove',
      async () => {
        const newState = await ConfigManager.toggleAutoApprove();
        logger.info(`Auto-Approve: ${newState ? 'ON' : 'OFF'}`);
        vscode.window.showInformationMessage(
          `Turbo Approve — Auto-Approve: ${newState ? 'ON' : 'OFF'}`,
        );
        syncState();
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('turboApprove.showStatus', () => {
      const config = ConfigManager.getConfig();
      const approveCount = autoApprover.getApproveCount();

      const items = [
        `Master: ${config.enabled ? '✅ ON' : '❌ OFF'}`,
        `Auto-Scroll: ${config.autoScroll ? '✅ ON' : '❌ OFF'}`,
        `Auto-Approve: ${config.autoApprove ? '✅ ON' : '❌ OFF'}`,
        `Approve Delay: ${config.approveDelay}ms`,
        `Notifications: ${config.showNotifications ? '✅ ON' : '❌ OFF'}`,
        `Total Approved: ${approveCount}`,
      ];

      vscode.window.showQuickPick(items, {
        title: '🚀 Turbo Approve Status',
        placeHolder: 'Current configuration',
      });
    }),
  );

  // Listen for config changes
  context.subscriptions.push(
    ConfigManager.onConfigChange(() => {
      logger.info('Configuration changed');
      syncState();
    }),
  );

  // Register disposables
  context.subscriptions.push(logger, autoScroller, autoApprover, statusBar);

  // Initial sync
  syncState();

  logger.info('Turbo Approve activated successfully! 🚀');
}

function syncState(): void {
  const config = ConfigManager.getConfig();

  // Update status bar
  statusBar.update(config);

  // Sync AutoScroller
  if (config.enabled && config.autoScroll) {
    autoScroller.start(config.scrollDebounce);
  } else {
    autoScroller.stop();
  }

  // Sync AutoApprover
  if (config.enabled && config.autoApprove) {
    autoApprover.start(config.approveDelay, config.showNotifications);
  } else {
    autoApprover.stop();
  }

  // Update AutoApprover config if already running
  if (config.enabled && config.autoApprove) {
    autoApprover.updateConfig(config.approveDelay, config.showNotifications);
  }

  if (config.enabled && config.autoScroll) {
    autoScroller.updateDebounce(config.scrollDebounce);
  }
}

export function deactivate(): void {
  logger?.info('Turbo Approve deactivated');
}
