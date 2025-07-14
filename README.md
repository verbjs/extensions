# Verb Framework Extensions

Developer tools and extensions to enhance your Verb framework development experience across different editors and IDEs.

## Available Extensions

### 🔧 [VS Code Extension](./vscode/)
**Official VS Code extension for Verb framework**

The complete development companion for building Verb applications in Visual Studio Code.

**Features:**
- ✅ **Syntax Highlighting** - Enhanced TypeScript/JavaScript highlighting for Verb patterns
- ✅ **IntelliSense** - Auto-completion, hover docs, and parameter hints
- ✅ **Code Snippets** - 15+ production-ready code snippets
- ✅ **Commands** - Interactive app creation and route generation
- ✅ **Project Detection** - Automatic Verb project recognition
- ✅ **Quick Actions** - Right-click context menus for common tasks

**Installation:**
```bash
# From VS Code Marketplace
ext install verb-framework

# Or install locally
cd extensions/vscode
bun install && bun run compile
vsce package && code --install-extension verb-framework-*.vsix
```

## Coming Soon

### 🧠 **IntelliJ IDEA Plugin**
*In Development*
- Syntax highlighting and code completion
- Live templates and file templates
- Integrated debugging support
- Project wizard for Verb applications

### 🌐 **Web-based Playground**
*Planned*
- Online code editor with Verb support
- Live preview and testing
- Shareable code snippets
- Integration with examples and documentation

### 🔍 **Chrome DevTools Extension**
*Planned*
- WebSocket connection inspector
- Protocol switching visualization
- Performance monitoring
- Request/response debugging

## Extension Development

### Getting Started

Each extension follows a consistent structure:

```
extension-name/
├── README.md              # Extension-specific documentation
├── package.json           # Extension manifest
├── src/                   # Source code
│   ├── extension.ts      # Main extension entry point
│   └── commands/         # Command implementations
├── snippets/             # Code snippets
│   ├── typescript.json  # TypeScript snippets
│   └── javascript.json  # JavaScript snippets
├── syntaxes/             # Syntax highlighting rules
└── tests/                # Extension tests
```

### Development Workflow

```bash
# Clone the repository
git clone https://github.com/verbjs/extensions.git
cd extensions/extension-name

# Install dependencies
bun install

# Start development
bun run watch

# Package extension
bun run package
```

### Extension Features

All Verb extensions provide these core features:

#### 🎨 **Syntax Highlighting**
- Verb-specific TypeScript/JavaScript patterns
- Configuration file highlighting
- Multi-protocol syntax support
- Error highlighting and validation

#### ⚡ **Code Snippets**
Standard snippets across all extensions:

| Snippet | Description | Languages |
|---------|-------------|-----------|
| `verb-app` | Complete Verb application | TS, JS |
| `verb-get` | GET route handler | TS, JS |
| `verb-post` | POST route handler | TS, JS |
| `verb-put` | PUT route handler | TS, JS |
| `verb-delete` | DELETE route handler | TS, JS |
| `verb-middleware` | Custom middleware | TS, JS |
| `verb-websocket` | WebSocket handler | TS, JS |
| `verb-upload` | File upload handler | TS, JS |
| `verb-error` | Error handling | TS, JS |
| `verb-cors` | CORS middleware | TS, JS |
| `verb-auth` | Authentication | TS, JS |
| `verb-static` | Static file serving | TS, JS |
| `verb-group` | Route group | TS, JS |
| `verb-controller` | RESTful controller | TS, JS |
| `verb-protocol` | Protocol gateway | TS, JS |

#### 🔧 **Commands**
Interactive commands for common tasks:

- **Create App** - Generate new Verb application structure
- **Add Route** - Interactive route creation wizard
- **Add WebSocket** - WebSocket endpoint generation
- **Add Middleware** - Middleware template insertion
- **Add Protocol** - Multi-protocol configuration
- **Generate Tests** - Test file generation

#### 💡 **IntelliSense**
- Auto-completion for Verb APIs
- Hover documentation with examples
- Parameter hints and type information
- Import suggestions and auto-imports
- Error detection and quick fixes

## Usage Examples

### Creating a New App
1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Run "Verb: Create App"
3. Select project folder and enter app name
4. Choose template (API-only, Full-stack, Microservices, etc.)
5. Start coding with full IntelliSense support!

### Using Snippets
Type any snippet prefix and press `Tab`:

```typescript
// Type: verb-app
import { createServer } from "verb";

const app = createServer();

app.get("/", (req, res) => {
  res.json({ message: "Hello, Verb!" });
});

export default app.listen(3000);
```

```typescript
// Type: verb-websocket
app.websocket("/ws", {
  open: (ws) => {
    console.log("WebSocket opened");
    ws.subscribe("channel");
  },
  message: (ws, data) => {
    console.log("Received:", data);
    ws.publish("channel", data);
  },
  close: (ws) => {
    console.log("WebSocket closed");
  }
});
```

### Adding Routes Interactively
1. Position cursor where you want the route
2. Run "Verb: Add Route" command
3. Select HTTP method (GET, POST, PUT, DELETE)
4. Enter route path (e.g., `/api/users/:id`)
5. Route template is inserted with proper typing

## Configuration

### VS Code Settings
```json
{
  "verb.autoImport": true,
  "verb.snippetPrefix": "verb",
  "verb.linting": true,
  "verb.experimental.protocolSwitching": true
}
```

### IntelliJ Settings
```xml
<component name="VerbSettings">
  <option name="autoImport" value="true" />
  <option name="snippetPrefix" value="verb" />
  <option name="enableLinting" value="true" />
</component>
```

## Supported File Types

All extensions support these file patterns:

- **TypeScript**: `.ts`, `.tsx`
- **JavaScript**: `.js`, `.jsx`
- **Config Files**: `.verb.json`, `.verb.config.js`, `.verb.config.ts`
- **Template Files**: `.verb.template`
- **Test Files**: `*.test.ts`, `*.spec.ts`

## Contributing

### Adding a New Extension

1. **Create extension directory**
   ```bash
   mkdir extensions/my-editor
   cd extensions/my-editor
   ```

2. **Follow extension structure**
   - Implement core features (syntax, snippets, commands)
   - Add comprehensive documentation
   - Include installation instructions
   - Add usage examples

3. **Test thoroughly**
   ```bash
   bun install
   bun run compile
   bun run test
   bun run package
   ```

4. **Update this README**
   - Add extension to the list above
   - Include installation and usage instructions
   - Document any unique features

### Extension Requirements

- ✅ **Syntax Highlighting** for Verb patterns
- ✅ **Core Snippets** (minimum 10 essential snippets)
- ✅ **IntelliSense** support where applicable
- ✅ **Project Detection** for Verb applications
- ✅ **Documentation** with examples
- ✅ **Installation** instructions
- ✅ **Testing** suite with >80% coverage

### Code Standards

- Use TypeScript for all extension code
- Follow editor-specific conventions
- Include comprehensive error handling
- Provide helpful error messages
- Support both TypeScript and JavaScript
- Include accessibility features

## Extension Architecture

### Common Components

```typescript
// Extension activation
export function activate(context: ExtensionContext) {
  // Register commands
  registerCommands(context);
  
  // Initialize language features
  initializeLanguageSupport(context);
  
  // Setup project detection
  setupProjectWatcher(context);
}

// Command registration
function registerCommands(context: ExtensionContext) {
  const commands = [
    'verb.createApp',
    'verb.addRoute',
    'verb.addWebSocket',
    'verb.addMiddleware'
  ];
  
  commands.forEach(command => {
    const disposable = vscode.commands.registerCommand(
      command, 
      commandHandlers[command]
    );
    context.subscriptions.push(disposable);
  });
}
```

### Language Support

```typescript
// IntelliSense provider
class VerbCompletionProvider implements CompletionItemProvider {
  provideCompletionItems(document, position) {
    const items = [];
    
    // Add Verb method completions
    items.push(...getVerbMethods());
    
    // Add snippet completions
    items.push(...getVerbSnippets());
    
    return items;
  }
}
```

## Support

- **Documentation**: [verb.codes/extensions](https://verb.codes/extensions)
- **VS Code Extension**: [marketplace.visualstudio.com](https://marketplace.visualstudio.com/items?itemName=verb-framework)
- **GitHub Issues**: [github.com/verbjs/extensions](https://github.com/verbjs/extensions)

## License

All extensions are MIT licensed. See individual extension directories for specific license information.

---

**Enhance your Verb development experience!** Install the extension for your favorite editor and start building faster. 🚀