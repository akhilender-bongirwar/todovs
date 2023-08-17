// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorldPanel';
import { SidebarProvider } from './SidebarProvider';
import { text } from 'stream/consumers';
import { authenticate } from './authenticate';
import { TokenManager } from './TokenManager';

export  function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "todovs" is now active!');
	TokenManager.globalState = context.globalState;

	console.log("token value = ",TokenManager.getToken());

	const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
	item.text = "$(add) Add Todo";
	item.command = "todovs.addToDo";
	item.show();
	context.subscriptions.push(
		vscode.commands.registerCommand('todovs.helloWorld', () => {
			// HelloWorldPanel.createOrShow(context.extensionUri);
			vscode.window.showInformationMessage(
				"token is :"+ TokenManager.getToken()
			);
		})
	),
	context.subscriptions.push(
		vscode.commands.registerCommand('todovs.authenticate', () => {
			try {
				authenticate();
			} catch (error) {
				console.log(error);
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("todovs.addToDo", () => {
		  const { activeTextEditor } = vscode.window;
	
		  if (!activeTextEditor) {
			vscode.window.showInformationMessage("No active text editor");
			return;
		  }
	
		  const text = activeTextEditor.document.getText( 
			activeTextEditor.selection
		  ); 
		  
		//   vscode.window.showInformationMessage(text);
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
