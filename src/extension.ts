import * as vscode from 'vscode';
import { dirname } from 'path';

let myStatusBarItem: vscode.StatusBarItem;
const myCommandId = 'cd-to-active-file-directory-in-statusbar.onClick';

export function activate(context: vscode.ExtensionContext) {
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -1);
	myStatusBarItem.command = myCommandId;
	context.subscriptions.push(myStatusBarItem);

	let disposable = vscode.commands.registerCommand(myCommandId, () => {
		const terminal = vscode.window.activeTerminal || vscode.window.createTerminal(vscode.env.shell);
		terminal.show();
		const textEditor = vscode.window.activeTextEditor;
		const diretoryPath = getDirectoryPath(textEditor);
		terminal.sendText(`cd '${diretoryPath}'`);
	});
	context.subscriptions.push(disposable);
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));
	updateStatusBarItem();
}

function getDirectoryPath(textEditor: vscode.TextEditor | undefined): string {
	let diretoryPath = '';
	if (textEditor) {
		const filePath = textEditor.document.fileName;
		diretoryPath = dirname(filePath);
	}
	return diretoryPath;
}

function updateStatusBarItem(): void {
	let textEditor = vscode.window.activeTextEditor;
	let diretoryPath = getDirectoryPath(textEditor);
	if (diretoryPath === '') {
		myStatusBarItem.tooltip = `click any file`;
		myStatusBarItem.text = `$(file-directory) no active file`;
		myStatusBarItem.command = undefined;
	} else {
		myStatusBarItem.tooltip = `cd ${diretoryPath}`;
		myStatusBarItem.text = `$(file-directory) cd active file directory`;
		myStatusBarItem.command = myCommandId;

	}
	myStatusBarItem.show();
}
