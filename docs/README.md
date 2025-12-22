# Extensions Documentation

Developer tools and IDE extensions for Verb framework.

## Available Extensions

### VS Code Extension

The official VS Code extension provides:

- **Syntax Highlighting** - Verb-specific patterns
- **IntelliSense** - Auto-completion and docs
- **Code Snippets** - 15+ production snippets
- **Commands** - Interactive scaffolding
- **Project Detection** - Auto-recognize Verb projects

#### Installation

```bash
# From VS Code Marketplace
ext install verb-framework

# Or install locally
cd extensions/vscode
bun install && bun run compile
vsce package
code --install-extension verb-framework-*.vsix
```

## Documentation

- [VS Code Setup](./vscode-setup.md) - Installation and configuration
- [Snippets](./snippets.md) - Available code snippets
- [Commands](./commands.md) - Extension commands
- [Development](./development.md) - Contributing to extensions

## Code Snippets

| Prefix | Description |
|--------|-------------|
| `verb-app` | Complete application |
| `verb-get` | GET route |
| `verb-post` | POST route |
| `verb-put` | PUT route |
| `verb-delete` | DELETE route |
| `verb-middleware` | Custom middleware |
| `verb-websocket` | WebSocket handler |
| `verb-upload` | File upload |
| `verb-error` | Error handling |
| `verb-cors` | CORS middleware |
| `verb-auth` | Authentication |
| `verb-static` | Static files |
| `verb-group` | Route group |
| `verb-controller` | REST controller |
| `verb-protocol` | Protocol gateway |

## Using Snippets

Type the snippet prefix and press `Tab`:

```typescript
// Type: verb-app
import { createServer } from "verb";

const app = createServer();

app.get("/", (req, res) => {
  res.json({ message: "Hello, Verb!" });
});

export default app.listen(3000);
```

## Commands

Access via Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

| Command | Description |
|---------|-------------|
| `Verb: Create App` | Generate new application |
| `Verb: Add Route` | Add route interactively |
| `Verb: Add WebSocket` | Add WebSocket endpoint |
| `Verb: Add Middleware` | Add middleware |
