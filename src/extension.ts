import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const gutterDecorationType = vscode.window.createTextEditorDecorationType({
gutterIconPath: vscode.Uri.parse(
  `data:image/svg+xml,${encodeURIComponent(
'<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 16 16"><g fill="none" stroke="red" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><circle cx="4.5" cy="3.5" r="1.75"/><circle cx="4.5" cy="12.5" r="1.75"/><circle cx="12.5" cy="8.5" r="1.75"/><path d="M4.75 10.25v-4.5c1 2 2 3 5.5 3"/></g></svg>'
    // '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"> \
    //    <circle cx="16" cy="16" r="16" fill="green" /> \
    //    <g transform="translate(16, 16)"> \
    //      <path fill="red" d="M-2.5 0A2.5 2.5 0 0 0 -3 4.95v5.1a2.5 2.5 0 1 0 1 0v-5.1A2.503 2.503 0 0 0 -0.05 3H4.5A2.5 2.5 0 0 1 7 5.5v1.55a2.5 2.5 0 1 0 1 0V5.5A3.5 3.5 0 0 0 4.5 2H-0.05A2.5 2.5 0 0 0 -2.5 0Z"/> \
    //    </g> \
    //  </svg>'
  )}`
),
    // gutterIconPath: vscode.Uri.parse(
    //   `data:image/svg+xml,${encodeURIComponent(
    //  '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="blue" /><path fill="red" transform="translate(16, 16)" d="M-2.5 0A2.5 2.5 0 0 0 -3 4.95v5.1a2.5 2.5 0 1 0 1 0v-5.1A2.503 2.503 0 0 0 -0.05 3H4.5A2.5 2.5 0 0 1 7 5.5v1.55a2.5 2.5 0 1 0 1 0V5.5A3.5 3.5 0 0 0 4.5 2H-0.05A2.5 2.5 0 0 0 -2.5 0Z"/></svg>'
    //   //  '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"> <circle cx="16" cy="16" r="16" fill="blue" /><path  fill="red" d="M2.5 0A2.5 2.5 0 0 0 2 4.95v5.1a2.5 2.5 0 1 0 1 0v-5.1A2.503 2.503 0 0 0 4.95 3H9.5A2.5 2.5 0 0 1 12 5.5v1.55a2.5 2.5 0 1 0 1 0V5.5A3.5 3.5 0 0 0 9.5 2H4.95A2.5 2.5 0 0 0 2.5 0Z"/></svg>'
    //   )}`
    // ),
    gutterIconSize: "75%", // Make icon slightly smaller than the gutter space

    isWholeLine: true,
    overviewRulerLane: vscode.OverviewRulerLane.Left,
  });

  let activeEditor = vscode.window.activeTextEditor;
  let timeout: number | undefined = undefined;

  // Update decorations when the active editor changes
  vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      activeEditor = editor;
      if (editor) {
        triggerUpdateDecorations();
      }
    },
    null,
    context.subscriptions
  );

  // Update decorations when the document changes
  vscode.workspace.onDidChangeTextDocument(
    (event) => {
      if (activeEditor && event.document === activeEditor.document) {
        triggerUpdateDecorations();
      }
    },
    null,
    context.subscriptions
  );

  function triggerUpdateDecorations() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
    timeout = setTimeout(updateDecorations, 500) as unknown as number;
  }

  function updateDecorations() {
    if (!activeEditor) {
      return;
    }

    const document = activeEditor.document;
    const decorations: vscode.DecorationOptions[] = [];

    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i);

      // Example condition: Add decoration to non-empty lines
      if (line.text.trim().length > 0) {
        const decoration: vscode.DecorationOptions = {
          range: line.range,
          hoverMessage: new vscode.MarkdownString(
            `**Line ${i + 1}**:${line.text.trim()}`
          ),
        };
        decorations.push(decoration);
      }
    }

    activeEditor.setDecorations(gutterDecorationType, decorations);
  }

  // Initial update
  if (activeEditor) {
    triggerUpdateDecorations();
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
