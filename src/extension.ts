import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('surfn.surf', () => {
    vscode.window.showInformationMessage('Hello World from surfn!');
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
  // TODO do something..
}
