# Web Components Todo App

A modern npm project showcasing three types of Web Components:
- Raw/Vanilla Web Components
- Polymer 3 Components
- Lit Components

## Features

✨ **Multiple Web Component Types** - All three types working together
🔥 **Hot Module Replacement** - Instant updates when you save files
⚡ **Vite Development Server** - Lightning-fast development experience
📦 **Modern Build System** - Production-ready build pipeline
🎨 **Beautiful UI** - Three todo apps with different styling

## Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server with auto-reload
npm run dev

# The server will open automatically at http://localhost:5173
```

When you save any file, the browser will automatically refresh to show your changes!

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
first-app/
├── src/
│   ├── components/
│   │   ├── raw/          # Vanilla Web Components
│   │   ├── polymer/      # Polymer 3 Components
│   │   └── lit/          # Lit Components
│   ├── main.js           # Entry point
│   └── style.css         # Global styles
├── index.html            # Main HTML file
├── package.json          # NPM configuration
└── vite.config.js        # Vite configuration
```

## Component Types

### 1. Raw Web Components
- Pure JavaScript implementation
- No framework dependencies
- Located in `src/components/raw/`

### 2. Polymer 3 Components
- Uses Polymer 3 library
- Data binding and observers
- Located in `src/components/polymer/`

### 3. Lit Components
- Modern, lightweight framework
- Reactive properties and templates
- Located in `src/components/lit/`

## Development Features

- **File Watching**: Any changes to files trigger automatic browser refresh
- **ES Modules**: Native module support in the browser
- **Fast Refresh**: Near-instant feedback loop
- **Source Maps**: Easy debugging with original source code

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run serve` - Start dev server with network access

## Technologies Used

- **Vite** - Next generation frontend tooling
- **Lit** - Simple, fast web components
- **Polymer 3** - Web components library
- **Vanilla JS** - Pure JavaScript web components

## License

MIT