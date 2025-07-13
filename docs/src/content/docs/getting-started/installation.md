---
title: Installation
description: How to install and set up lift-html in your project
---

# Installation

Lift HTML can be installed in several ways depending on your project setup and preferences.

## Prerequisites

Before installing Lift HTML, make sure you have:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** or **pnpm** package manager
- A modern web browser with support for Web Components

## Installation Methods

### NPM (Recommended)

```bash
npm install lift-html
```

### Yarn

```bash
yarn add lift-html
```

### PNPM

```bash
pnpm add lift-html
```

### CDN (for quick prototyping)

```html
<script type="module">
  import { defineComponent } from 'https://esm.sh/lift-html';
</script>
```

## TypeScript Support

Lift HTML includes full TypeScript support out of the box. If you're using TypeScript, you'll get:

- Full type checking for component definitions
- IntelliSense support in your IDE
- Type-safe props and events

No additional `@types` package is required.

## Framework Integration

Lift HTML is designed to work with any framework or build tool:

### Vite

```bash
npm install lift-html
```

```javascript
// vite.config.js
export default {
  // Your existing Vite config
  // Lift HTML works out of the box
}
```

### Webpack

```bash
npm install lift-html
```

```javascript
// webpack.config.js
module.exports = {
  // Your existing Webpack config
  // Lift HTML works out of the box
}
```

### Create React App

```bash
npm install lift-html
```

```javascript
// You can use Lift HTML components alongside React components
import { defineComponent } from 'lift-html';
```

### Next.js

```bash
npm install lift-html
```

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js config
  // Lift HTML works out of the box
}

module.exports = nextConfig
```

## Verification

To verify your installation, create a simple test:

```javascript
import { defineComponent } from 'lift-html';

const TestComponent = defineComponent({
  name: 'test-component',
  template: '<div>Hello from Lift HTML!</div>'
});

// Register the component
TestComponent.register();
```

Then in your HTML:

```html
<test-component></test-component>
```

If you see "Hello from Lift HTML!" in your browser, the installation was successful!

## Next Steps

- [Quick Start](/getting-started/quick-start/) - Build your first component
- [Basic Usage](/guides/basic-usage/) - Learn the fundamentals
- [Components](/guides/components/) - Create reusable components