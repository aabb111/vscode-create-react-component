import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.createComponent",
    async (uri: vscode.Uri | undefined) => {
      if (uri) {
        const componentFolderName = await vscode.window.showInputBox({
          prompt: "Enter component name",
          placeHolder: "ComponentName",
        });

        if (componentFolderName) {
          const folderPath = uri.fsPath;
          const componentFolderPath = path.join(
            folderPath,
            componentFolderName
          );
          const componentFileName = `${componentFolderName}.tsx`;
          const indexFileName = "index.ts";

          // Create the component folder if it doesn't exist
          if (!fs.existsSync(componentFolderPath)) {
            fs.mkdirSync(componentFolderPath);
          }

          // Create the .tsx file
          const tsxFilePath = path.join(componentFolderPath, componentFileName);
          let tsxFileContent = `export function ${componentFolderName}() {
    return <div>${componentFolderName}</div>;
}`;
          fs.writeFileSync(tsxFilePath, tsxFileContent, "utf-8");

          // Create the index.ts file
          const indexFilePath = path.join(componentFolderPath, indexFileName);
          let indexFileContent = `export * from "./${componentFileName}";`;
          fs.writeFileSync(indexFilePath, indexFileContent, "utf-8");

          vscode.window.showInformationMessage(
            `Component ${componentFolderName} created successfully.`
          );
        }
      } else {
        vscode.window.showWarningMessage(
          "Please right-click on a folder to create a component."
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
