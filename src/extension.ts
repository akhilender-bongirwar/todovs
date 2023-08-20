// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';
import { authenticate } from './authenticate';
import { TokenManager } from './TokenManager';

export  function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "vsnote" is now active!');
	TokenManager.globalState = context.globalState;

	const authFunc = () =>{
		console.log("authFunc is executed succesfully...");
	};

	console.log("token value = ",TokenManager.getToken());

	const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
	item.text = "$(note) Add Note";
	item.command = "vsnote.addToDo";
	item.show();

	context.subscriptions.push(
		vscode.commands.registerCommand('vsnote.helloWorld', () => {
			vscode.window.showInformationMessage(
				"token is :"+ TokenManager.getToken()
			);
		})
	),
	context.subscriptions.push(
		vscode.commands.registerCommand('vsnote.authenticate', () => {
			try {
				authenticate(authFunc);
			} catch (error) {
				console.log(error);
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('vsnote.success', () => {
			vscode.window.showInformationMessage("Added Note Sucessfully");
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('vsnote.fail', () => {
			vscode.window.showErrorMessage("Adding Note Failed!!!");
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("vsnote.addToDo", () => {
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
       "vsnote-sidebar",
       sidebarProvider
    )
  );

	context.subscriptions.push(
		vscode.commands.registerCommand('vsnote.refresh', async () => {
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user
			await vscode.commands.executeCommand("workbench.action.closeSidebar");
			await vscode.commands.executeCommand("workbench.view.extension.vsnote-sidebar-view");
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
