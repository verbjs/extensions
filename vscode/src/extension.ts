import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Verb Framework extension is now active!');

    // Register commands
    const createAppCommand = vscode.commands.registerCommand('verb.createApp', createVerbApp);
    const addRouteCommand = vscode.commands.registerCommand('verb.addRoute', addRoute);
    const addWebSocketCommand = vscode.commands.registerCommand('verb.addWebSocket', addWebSocket);
    const addMiddlewareCommand = vscode.commands.registerCommand('verb.addMiddleware', addMiddleware);

    context.subscriptions.push(
        createAppCommand,
        addRouteCommand,
        addWebSocketCommand,
        addMiddlewareCommand
    );

    // Register completion provider for better IntelliSense
    const completionProvider = vscode.languages.registerCompletionItemProvider(
        ['typescript', 'javascript'],
        new VerbCompletionProvider(),
        '.',
        '('
    );

    context.subscriptions.push(completionProvider);

    // Register hover provider for documentation
    const hoverProvider = vscode.languages.registerHoverProvider(
        ['typescript', 'javascript'],
        new VerbHoverProvider()
    );

    context.subscriptions.push(hoverProvider);

    // Auto-detect Verb projects and show welcome message
    detectVerbProject();
}

async function createVerbApp() {
    const folderUri = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        canSelectMany: false,
        openLabel: 'Select folder for Verb app'
    });

    if (!folderUri || folderUri.length === 0) {
        return;
    }

    const folder = folderUri[0];
    const appName = await vscode.window.showInputBox({
        prompt: 'Enter app name',
        value: 'my-verb-app'
    });

    if (!appName) {
        return;
    }

    try {
        // Create basic Verb app structure
        const appContent = `import { Verb } from 'verb';

const app = new Verb();

app.get('/', (req, res) => {
  return res.json({ message: 'Hello from Verb!' });
});

app.get('/health', (req, res) => {
  return res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
`;

        const packageJsonContent = `{
  "name": "${appName}",
  "version": "1.0.0",
  "description": "A Verb framework application",
  "main": "src/index.ts",
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "start": "bun src/index.ts",
    "build": "bun build src/index.ts --outdir dist"
  },
  "dependencies": {
    "verb": "latest"
  },
  "devDependencies": {
    "@types/bun": "latest"
  }
}
`;

        const appFile = vscode.Uri.joinPath(folder, 'src', 'index.ts');
        const packageFile = vscode.Uri.joinPath(folder, 'package.json');

        await vscode.workspace.fs.createDirectory(vscode.Uri.joinPath(folder, 'src'));
        await vscode.workspace.fs.writeFile(appFile, Buffer.from(appContent));
        await vscode.workspace.fs.writeFile(packageFile, Buffer.from(packageJsonContent));

        // Open the created files
        const document = await vscode.workspace.openTextDocument(appFile);
        await vscode.window.showTextDocument(document);

        vscode.window.showInformationMessage(`Verb app "${appName}" created successfully!`);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to create Verb app: ${error}`);
    }
}

async function addRoute() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
    }

    const method = await vscode.window.showQuickPick(
        ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        { placeHolder: 'Select HTTP method' }
    );

    if (!method) return;

    const path = await vscode.window.showInputBox({
        prompt: 'Enter route path',
        value: '/api/resource'
    });

    if (!path) return;

    const routeTemplate = `
app.${method.toLowerCase()}('${path}', ${method === 'GET' ? '' : 'async '}(req, res) => {
  ${method !== 'GET' ? 'const data = await req.json();\n  ' : ''}// Handle ${method} request
  return res.json({ message: '${method} ${path}' });
});
`;

    editor.edit(editBuilder => {
        editBuilder.insert(editor.selection.active, routeTemplate);
    });
}

async function addWebSocket() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
    }

    const path = await vscode.window.showInputBox({
        prompt: 'Enter WebSocket path',
        value: '/ws/chat'
    });

    if (!path) return;

    const wsTemplate = `
app.websocket('${path}', {
  open: (ws) => {
    console.log('WebSocket connection opened');
    ws.subscribe('channel');
  },
  message: (ws, data) => {
    console.log('Received:', data);
    ws.publish('channel', data);
  },
  close: (ws) => {
    console.log('WebSocket connection closed');
  }
});
`;

    editor.edit(editBuilder => {
        editBuilder.insert(editor.selection.active, wsTemplate);
    });
}

async function addMiddleware() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
    }

    const middlewareType = await vscode.window.showQuickPick([
        'Custom Middleware',
        'Auth Middleware',
        'CORS Middleware',
        'Logging Middleware'
    ], { placeHolder: 'Select middleware type' });

    if (!middlewareType) return;

    let template = '';

    switch (middlewareType) {
        case 'Custom Middleware':
            template = `
const customMiddleware = (req, res, next) => {
  // Custom middleware logic
  return next();
};

app.use(customMiddleware);
`;
            break;
        case 'Auth Middleware':
            template = `
const authMiddleware = (req, res, next) => {
  const token = req.headers.get('authorization');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Verify token
  return next();
};

app.use(authMiddleware);
`;
            break;
        case 'CORS Middleware':
            template = `
app.use((req, res, next) => {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).send();
  }
  
  return next();
});
`;
            break;
        case 'Logging Middleware':
            template = `
app.use((req, res, next) => {
  const start = performance.now();
  console.log(\`\${req.method} \${req.url} - Started\`);
  
  res.on('finish', () => {
    const duration = performance.now() - start;
    console.log(\`\${req.method} \${req.url} - \${res.statusCode} (\${duration.toFixed(2)}ms)\`);
  });
  
  return next();
});
`;
            break;
    }

    editor.edit(editBuilder => {
        editBuilder.insert(editor.selection.active, template);
    });
}

class VerbCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.CompletionItem[] {
        const line = document.lineAt(position);
        const text = line.text.substr(0, position.character);

        if (text.includes('app.')) {
            return this.getAppMethods();
        }

        if (text.includes('res.')) {
            return this.getResponseMethods();
        }

        if (text.includes('req.')) {
            return this.getRequestMethods();
        }

        return [];
    }

    private getAppMethods(): vscode.CompletionItem[] {
        const methods = ['get', 'post', 'put', 'delete', 'patch', 'use', 'websocket', 'static', 'listen'];
        
        return methods.map(method => {
            const item = new vscode.CompletionItem(method, vscode.CompletionItemKind.Method);
            item.detail = `app.${method}()`;
            item.documentation = new vscode.MarkdownString(`Verb app method: ${method}`);
            return item;
        });
    }

    private getResponseMethods(): vscode.CompletionItem[] {
        const methods = [
            { name: 'json', detail: 'res.json(data)', doc: 'Send JSON response' },
            { name: 'text', detail: 'res.text(string)', doc: 'Send text response' },
            { name: 'status', detail: 'res.status(code)', doc: 'Set status code' },
            { name: 'headers', detail: 'res.headers', doc: 'Response headers' },
            { name: 'send', detail: 'res.send()', doc: 'Send response' }
        ];

        return methods.map(method => {
            const item = new vscode.CompletionItem(method.name, vscode.CompletionItemKind.Method);
            item.detail = method.detail;
            item.documentation = new vscode.MarkdownString(method.doc);
            return item;
        });
    }

    private getRequestMethods(): vscode.CompletionItem[] {
        const methods = [
            { name: 'json', detail: 'await req.json()', doc: 'Parse JSON body' },
            { name: 'text', detail: 'await req.text()', doc: 'Get text body' },
            { name: 'formData', detail: 'await req.formData()', doc: 'Parse form data' },
            { name: 'params', detail: 'req.params', doc: 'Route parameters' },
            { name: 'query', detail: 'req.query', doc: 'Query parameters' },
            { name: 'headers', detail: 'req.headers', doc: 'Request headers' },
            { name: 'method', detail: 'req.method', doc: 'HTTP method' },
            { name: 'url', detail: 'req.url', doc: 'Request URL' }
        ];

        return methods.map(method => {
            const item = new vscode.CompletionItem(method.name, vscode.CompletionItemKind.Property);
            item.detail = method.detail;
            item.documentation = new vscode.MarkdownString(method.doc);
            return item;
        });
    }
}

class VerbHoverProvider implements vscode.HoverProvider {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.Hover | undefined {
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);

        const hoverMap: { [key: string]: string } = {
            'app': 'Verb application instance - the main entry point for creating routes and middleware',
            'get': 'HTTP GET route handler - handles GET requests to specified path',
            'post': 'HTTP POST route handler - handles POST requests to specified path',
            'put': 'HTTP PUT route handler - handles PUT requests to specified path',
            'delete': 'HTTP DELETE route handler - handles DELETE requests to specified path',
            'websocket': 'WebSocket handler - creates WebSocket endpoint for real-time communication',
            'use': 'Middleware registration - adds middleware to the application stack',
            'static': 'Static file serving - serves static files from specified directory',
            'listen': 'Start server - begins listening for connections on specified port'
        };

        if (hoverMap[word]) {
            return new vscode.Hover(new vscode.MarkdownString(hoverMap[word]));
        }

        return undefined;
    }
}

function detectVerbProject() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) return;

    const packageJsonPath = vscode.Uri.joinPath(workspaceFolder.uri, 'package.json');
    
    vscode.workspace.fs.readFile(packageJsonPath).then(content => {
        const packageJson = JSON.parse(content.toString());
        
        if (packageJson.dependencies?.verb || packageJson.devDependencies?.verb) {
            vscode.window.showInformationMessage(
                'Verb project detected! Use Ctrl+Shift+P and search for "Verb" commands.',
                'Show Commands'
            ).then(selection => {
                if (selection === 'Show Commands') {
                    vscode.commands.executeCommand('workbench.action.showCommands');
                }
            });
        }
    }).catch(() => {
        // Package.json doesn't exist or isn't readable, ignore
    });
}

export function deactivate() {}