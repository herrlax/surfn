import * as vscode from 'vscode';
import { URI } from 'vscode-uri';

const {
  commands,
  window: {
    activeTextEditor,
    showInformationMessage,
    showErrorMessage,
    showTextDocument,
    showInputBox,
  },
  workspace,
  Position,
} = vscode;

export function activate(context: vscode.ExtensionContext) {
  const disposable = commands.registerCommand('surfn.surf', async () => {
    if (!activeTextEditor || !workspace) {
      showErrorMessage('Failed to init extension surfn');
      return;
    }

    const { document, selection } = activeTextEditor;

    const selectedText = document.getText(selection).trim();

    const fileUri = await createStyledFile(document);

    const doc = await workspace.openTextDocument(fileUri);
    const editor = await showTextDocument(doc);

    await insertImport(doc, editor);
    await insertStyledElements(editor, selectedText);

    showInformationMessage('Successfully created styled.ts 🏄‍♂️');
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
  showTextDocument;
  // TODO do something?
}

const getFilePath = async (documentPath: string) => {
  const fileType = documentPath.endsWith('.tsx') ? '.ts' : '.js';
  const documentPathArray = documentPath.split('/');
  const parentPath = documentPathArray
    .slice(0, documentPathArray.length - 1)
    .join('/');
  const defaultFileName = `styled${fileType}`;

  const userInput = await showInputBox({
    placeHolder: `Name of style file (defaults to ${defaultFileName})`,
  });

  const fileName = userInput?.trim() ? userInput.trim() : defaultFileName;
  const fileTypeIsMissing =
    !fileName.endsWith('.ts') && !fileName.endsWith('.js');

  return `${parentPath}/${fileName}${fileTypeIsMissing ? fileType : ''}`.trim();
};

// Creates a styled.ts file
const createStyledFile = async (doc: vscode.TextDocument) => {
  const filePath = await getFilePath(doc.fileName);

  try {
    await workspace.fs.stat(URI.file(filePath)); // check if file exists already
    return URI.file(filePath);
  } catch (e) {
    // creates new file if it doesn't exist
    return URI.file(filePath).with({ scheme: 'untitled' });
  }
};

const styledElementFromClasses = (name: string, text: string) => {
  const trimmedText = text.replace(/("|')/g, '');
  const prefix = `\nexport const ${name} = tw.div\``;
  const classNames = trimmedText.split(' ').join('\n  ');
  const sufix = '`;\n';

  return `${prefix}\n  ${classNames}\n${sufix}`;
};

const TW_CLASS_REGEX = /"[a-zA-Z0-9\s-:[\]\n]*"*/g;

const insertStyledElements = async (
  editor: vscode.TextEditor,
  text: string
) => {
  const classMatches = text.match(TW_CLASS_REGEX) || [];

  return editor.edit(async builder => {
    classMatches.forEach((match, idx) => {
      builder.insert(
        new Position(editor.document.lineCount, 0),
        styledElementFromClasses(`StyledElement${idx + 1}`, match)
      );
    });
  });
};

const TWSC_IMPORT = "import tw from 'tailwind-styled-components';";

/**
 * Inserts import statement if needed
 */
const insertImport = async (
  doc: vscode.TextDocument,
  editor: vscode.TextEditor
) => {
  if (!doc.getText().includes(TWSC_IMPORT)) {
    return editor.edit(builder => {
      builder.insert(new Position(0, 0), `${TWSC_IMPORT}\n`);
    });
  }

  return Promise.resolve();
};
