import * as vscode from 'vscode';

export interface TurboConfig {
  enabled: boolean;
  autoScroll: boolean;
  autoApprove: boolean;
  approveDelay: number;
  showNotifications: boolean;
  scrollDebounce: number;
}

export class ConfigManager {
  private static readonly SECTION = 'turboApprove';

  static getConfig(): TurboConfig {
    const config = vscode.workspace.getConfiguration(this.SECTION);
    return {
      enabled: config.get<boolean>('enabled', false),
      autoScroll: config.get<boolean>('autoScroll', true),
      autoApprove: config.get<boolean>('autoApprove', true),
      approveDelay: config.get<number>('approveDelay', 500),
      showNotifications: config.get<boolean>('showNotifications', true),
      scrollDebounce: config.get<number>('scrollDebounce', 150),
    };
  }

  static async setEnabled(enabled: boolean): Promise<void> {
    const config = vscode.workspace.getConfiguration(this.SECTION);
    await config.update('enabled', enabled, vscode.ConfigurationTarget.Global);
  }

  static async toggleEnabled(): Promise<boolean> {
    const current = this.getConfig().enabled;
    await this.setEnabled(!current);
    return !current;
  }

  static async toggleAutoScroll(): Promise<boolean> {
    const config = vscode.workspace.getConfiguration(this.SECTION);
    const current = config.get<boolean>('autoScroll', true);
    await config.update(
      'autoScroll',
      !current,
      vscode.ConfigurationTarget.Global,
    );
    return !current;
  }

  static async toggleAutoApprove(): Promise<boolean> {
    const config = vscode.workspace.getConfiguration(this.SECTION);
    const current = config.get<boolean>('autoApprove', true);
    await config.update(
      'autoApprove',
      !current,
      vscode.ConfigurationTarget.Global,
    );
    return !current;
  }

  static onConfigChange(
    callback: (config: TurboConfig) => void,
  ): vscode.Disposable {
    return vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(this.SECTION)) {
        callback(this.getConfig());
      }
    });
  }
}
