// Main entry point - imports all three types of Web Components
import './style.css';

// Import Raw Web Component
import './components/raw/todo-raw.ts';

// Import Polymer Component
import './components/polymer/todo-polymer.ts';

// Import Lit Component
import './components/lit/todo-lit.ts';

// Import Lit v1 Components (lit-element 2.x)
import './components/lit-v1/todo-lit-v1.ts';
import './components/lit-v1/counter-lit-v1.ts';

console.log('🚀 Web Components App Started!');
console.log('✅ Raw Web Component loaded');
console.log('✅ Polymer 3 Component loaded');
console.log('✅ Lit Component loaded');
console.log('✅ Lit v1 (lit-element 2.x) Component loaded');

// Hot Module Replacement
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log('🔄 HMR: Module updated');
  });
}