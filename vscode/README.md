# Verb Framework VS Code Extension

Official VS Code extension for the Verb web framework, providing syntax highlighting, code snippets, IntelliSense, and productivity commands.

## Features

### 🎨 Syntax Highlighting
- Enhanced TypeScript/JavaScript highlighting for Verb-specific patterns
- Syntax highlighting for Verb configuration files

### ⚡ Code Snippets
- `verb-app` - Create basic Verb application
- `verb-get` - GET route handler
- `verb-post` - POST route handler  
- `verb-put` - PUT route handler
- `verb-delete` - DELETE route handler
- `verb-middleware` - Custom middleware
- `verb-auth` - Authentication middleware
- `verb-websocket` - WebSocket handler
- `verb-upload` - File upload handler
- `verb-static` - Static file serving
- `verb-error` - Error handling middleware
- `verb-cors` - CORS middleware
- `verb-group` - RESTful route group
- `verb-controller` - RESTful controller

### 🔧 Commands
- **Verb: Create App** - Create new Verb application structure
- **Verb: Add Route** - Interactive route creation
- **Verb: Add WebSocket Handler** - Add WebSocket endpoint
- **Verb: Add Middleware** - Add various middleware types

### 💡 IntelliSense
- Auto-completion for Verb methods and properties
- Hover documentation for Verb APIs
- Parameter hints for route handlers and middleware

### 🚀 Quick Actions
- Right-click in explorer to create Verb apps
- Auto-detection of Verb projects
- Quick middleware and route templates

## Installation

1. Install from VS Code Marketplace
2. Or install locally:
   ```bash
   cd extensions/vscode
   bun install
   bun run compile
   vsce package
   code --install-extension verb-framework-1.0.0.vsix
   ```

## Usage

### Creating a New Verb App
1. Open Command Palette (`Ctrl+Shift+P`)
2. Run "Verb: Create App"
3. Select folder and enter app name
4. Start coding with IntelliSense and snippets!

### Using Snippets
Type snippet prefix and press `Tab`:

```typescript
verb-app  // Creates complete app structure
verb-get  // Creates GET route
verb-ws   // Creates WebSocket handler
```

### Route Creation
1. Use Command Palette: "Verb: Add Route"
2. Select HTTP method
3. Enter route path
4. Template is inserted at cursor

## Configuration

Configure the extension in VS Code settings:

```json
{
  "verb.autoImport": true,
  "verb.snippetPrefix": "verb",
  "verb.linting": true
}
```

## Supported File Types
- `.ts` - TypeScript files
- `.js` - JavaScript files  
- `.verb.json` - Verb configuration
- `.verb.config.js/ts` - Verb config files

## Examples

### Basic App with Snippets
```typescript
// Type: verb-app
import { Verb } from 'verb';

const app = new Verb();

// Type: verb-get
app.get('/users', async (req, res) => {
  // Handle request
  return res.json({ data: 'response' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### WebSocket with Snippet
```typescript
// Type: verb-websocket
app.websocket('/ws/chat', {
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
```

## Development

To contribute to this extension:

```bash
git clone <repo>
cd extensions/vscode
bun install
bun run compile
```

Press `F5` in VS Code to launch Extension Development Host.

## Changelog

### 1.0.0
- Initial release
- Basic snippets and commands
- IntelliSense support
- Syntax highlighting
- Project detection

## License

MIT License - see LICENSE file for details.