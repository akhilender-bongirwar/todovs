// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorldPanel';
import { SidebarProvider } from './SidebarProvider';
import { text } from 'stream/consumers';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export  function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "todovs" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	context.subscriptions.push(
		vscode.commands.registerCommand('todovs.helloWorld', () => {
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user
			HelloWorldPanel.createOrShow(context.extensionUri);
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand("todovs.addTodo", () => {
		  const { activeTextEditor } = vscode.window;
	
		  if (!activeTextEditor) {
			vscode.window.showInformationMessage("No active text editor");
			return;
		  }
	
		  const text = activeTextEditor.document.getText(
			activeTextEditor.selection
		  );
	
		  sidebarProvider._view?.webview.postMessage({
			type: "new-todo",
			value: text,
		  });
		})
	  );

	const sidebarProvider = new SidebarProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
       "todovs-sidebar",
       sidebarProvider
    )
  );

	context.subscriptions.push(
		vscode.commands.registerCommand('todovs.refresh', async () => {
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user
			// HelloWorldPanel.kill();
			// HelloWorldPanel.createOrShow(context.extensionUri);
			await vscode.commands.executeCommand("workbench.action.closeSidebar");
			await vscode.commands.executeCommand("workbench.view.extension.todovs-sidebar-view");
			setTimeout(()=>{
				vscode.commands.executeCommand(
					"workbench.action.webview.openDeveloperTools"
				);
			},500);
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
