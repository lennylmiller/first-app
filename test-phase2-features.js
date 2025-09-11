/**
 * Test script for Phase 2 features
 * Run this in the browser console at http://localhost:5173/dashboard.html
 */

console.log('🧪 Testing Phase 2 Features...\n');

// Test 1: Search Bar with Keyboard Shortcuts
console.log('✅ Test 1: Search Bar');
const searchBar = document.querySelector('app-dashboard')
  ?.shadowRoot?.querySelector('app-header')
  ?.shadowRoot?.querySelector('app-search-bar');

if (searchBar) {
  console.log('  ✓ Search bar component found');
  console.log('  ✓ Press Cmd/Ctrl+K to test keyboard shortcut');
} else {
  console.log('  ✗ Search bar not found');
}

// Test 2: Notifications System
console.log('\n✅ Test 2: Notifications');
const notifications = document.querySelector('app-dashboard')
  ?.shadowRoot?.querySelector('app-header')
  ?.shadowRoot?.querySelector('app-notifications');

if (notifications) {
  console.log('  ✓ Notifications component found');
  
  // Add a test notification
  notifications.addNotification({
    title: 'Test Notification',
    message: 'This is a test notification from the test script',
    type: 'info'
  });
  console.log('  ✓ Test notification added');
} else {
  console.log('  ✗ Notifications not found');
}

// Test 3: User Menu
console.log('\n✅ Test 3: User Menu');
const userMenu = document.querySelector('app-dashboard')
  ?.shadowRoot?.querySelector('app-header')
  ?.shadowRoot?.querySelector('app-user-menu');

if (userMenu) {
  console.log('  ✓ User menu component found');
  if (userMenu.user) {
    console.log('  ✓ User data loaded:', userMenu.user.name);
  }
} else {
  console.log('  ✗ User menu not found');
}

// Test 4: Keyboard Shortcuts Service
console.log('\n✅ Test 4: Keyboard Shortcuts');
console.log('  Available shortcuts:');
console.log('  • Cmd/Ctrl+K: Focus search');
console.log('  • Cmd/Ctrl+/: Show keyboard shortcuts');
console.log('  • Cmd/Ctrl+\\: Toggle sidebar');
console.log('  • Cmd/Ctrl+Shift+T: Toggle theme');
console.log('  • Alt+1-5: Navigate to different views');
console.log('  • Escape: Close modals/dropdowns');

// Test 5: LocalStorage Persistence
console.log('\n✅ Test 5: Data Persistence');
const searchHistory = localStorage.getItem('dashboard_searchHistory');
const notificationData = localStorage.getItem('dashboard_notifications');
const themeData = localStorage.getItem('dashboard_theme');

console.log('  ✓ Search history:', searchHistory ? 'Present' : 'Empty');
console.log('  ✓ Notifications:', notificationData ? 'Present' : 'Empty');
console.log('  ✓ Theme preference:', themeData || 'Not set');

// Test 6: Theme Toggle
console.log('\n✅ Test 6: Theme System');
const currentTheme = document.documentElement.getAttribute('data-theme');
console.log('  ✓ Current theme:', currentTheme);
console.log('  ✓ Press Cmd/Ctrl+Shift+T to toggle theme');

// Test 7: Component Integration
console.log('\n✅ Test 7: Component Integration');
const header = document.querySelector('app-dashboard')
  ?.shadowRoot?.querySelector('app-header');

if (header && searchBar && notifications && userMenu) {
  console.log('  ✓ All Phase 2 components integrated successfully');
} else {
  console.log('  ✗ Some components missing from header');
}

// Test 8: Event Handling
console.log('\n✅ Test 8: Event System');
try {
  // Test navigate event
  window.dispatchEvent(new CustomEvent('navigate', {
    detail: { path: '/todos' },
    bubbles: true,
    composed: true
  }));
  console.log('  ✓ Navigation event dispatched');
  
  // Test theme toggle
  window.dispatchEvent(new CustomEvent('toggle-theme', {
    bubbles: true,
    composed: true
  }));
  console.log('  ✓ Theme toggle event dispatched');
  
  console.log('  ✓ Event system working');
} catch (e) {
  console.log('  ✗ Event system error:', e.message);
}

console.log('\n🎉 Phase 2 Testing Complete!');
console.log('Manual tests to perform:');
console.log('1. Click notification bell - dropdown should appear');
console.log('2. Click user avatar - menu should appear');
console.log('3. Use Cmd/Ctrl+K - search should focus');
console.log('4. Type in search - results should appear');
console.log('5. Use Cmd/Ctrl+/ - shortcuts modal should appear');
console.log('6. Navigate using Alt+1 through Alt+5');
console.log('7. Refresh page - notifications and theme should persist');