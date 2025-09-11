# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Web Components showcase application demonstrating three different Web Component technologies working together:
- Raw/Vanilla Web Components (pure JavaScript, no framework)
- Polymer 3 Components (using @polymer/polymer library)
- Lit Components (both Lit v3 and lit-element v2.x/Lit v1)

Each component type implements a Todo list with local storage persistence and a settings modal.

## Development Commands

### Running the Application
```bash
# Install dependencies
npm install

# Start development server with hot module replacement
npm run dev
# Opens automatically at http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview

# Start dev server with network access
npm run serve
```

## Architecture

### Technology Stack
- **Build Tool**: Vite (configuration in `vite.config.js`)
- **Module System**: ES Modules with native browser support
- **Components**: Web Components using customElements API
- **State Management**: Component-local state with localStorage persistence
- **Styling**: Shadow DOM encapsulated styles

### Directory Structure
- `src/components/raw/` - Vanilla JavaScript Web Components using template literals
- `src/components/polymer/` - Polymer 3 components with data binding
- `src/components/lit/` - Modern Lit v3 components
- `src/components/lit-v1/` - Legacy lit-element 2.x components
- `src/main.js` - Entry point that imports all component types
- `index.html` - Main HTML with component usage examples

### Component Architecture Patterns

#### Raw Web Components
- Uses `HTMLElement` class extension
- Manual Shadow DOM creation with `template.cloneNode()`
- Event listeners added in `connectedCallback()`
- Manual DOM manipulation for updates

#### Polymer 3 Components
- Extends `PolymerElement` with declarative template
- Two-way data binding with `{{property::event}}`
- Array mutation with `push()`, `splice()`, `set()`
- Observers for automatic side effects

#### Lit Components (v3)
- Extends `LitElement` with reactive properties
- Declarative templates with tagged template literals
- Reactive state management with `@state` decorator
- Event handling with `@click` syntax

#### Lit v1 Components (lit-element 2.x)
- Legacy syntax with `static get properties()`
- Property binding with `.value` syntax
- Manual input handling required

### Key Technical Patterns

#### Component Registration
All components must be registered with `customElements.define()`:
```javascript
customElements.define('component-name', ComponentClass);
```

#### Local Storage Pattern
Each component type uses a unique storage key:
- `raw-todo-list` for vanilla components
- `polymer-todo-list` for Polymer
- `lit-todo-list` for Lit v3
- `lit-v1-todo-list` for lit-element 2.x

#### Shadow DOM Styling
All components use Shadow DOM for style encapsulation. The `:host` selector targets the component element itself.

#### Modal Implementation
Each component implements a settings modal with:
- Overlay click to close
- Escape key handling (Raw component only)
- Clear storage functionality with confirmation

### Development Features

#### Hot Module Replacement
Vite provides instant updates when saving files. The main.js includes HMR acceptance:
```javascript
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log('🔄 HMR: Module updated');
  });
}
```

#### Vite Configuration
- Development server on port 5173 with auto-open
- ES2020 build target
- Optimized dependencies include lit and @polymer/polymer
- Library build mode for ES modules output