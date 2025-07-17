---
title: Installation
description: How to install and set up lift-html in your project
---

# Installation

Lift HTML is available as multiple packages depending on your needs. Choose the package that best fits your project requirements.

## Available Packages

### @lift-html/core
The core package providing the basic `liftHtml` function for creating web components. Perfect for simple components that don't need reactive state management.

**Bundle size:** ~600 bytes gzipped

### @lift-html/solid
Includes the core functionality plus SolidJS integration for reactive components. Provides `liftSolid` function and `useAttributes` helper.

**Bundle size:** ~3.4kb gzipped (includes solid-js)

### @lift-html/tiny
Minimal package for the most basic use cases. Provides just the essential functionality.

**Bundle size:** ~150 bytes gzipped

## Prerequisites

Before installing Lift HTML, make sure you have:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** or **pnpm** package manager
- A modern web browser with support for Web Components

## Installation Methods

### NPM (Recommended)

For core functionality:
```bash
npm install @lift-html/core
```

For SolidJS integration:
```bash
npm install @lift-html/solid
```

### Yarn

For core functionality:
```bash
yarn add @lift-html/core
```

For SolidJS integration:
```bash
yarn add @lift-html/solid
```

### PNPM

For core functionality:
```bash
pnpm add @lift-html/core
```

For SolidJS integration:
```bash
pnpm add @lift-html/solid
```

### CDN (for quick prototyping)

For core functionality:
```html
<script type="module">
  import { liftHtml } from "https://esm.sh/@lift-html/core";
</script>
```

For SolidJS integration:
```html
<script type="module">
  import { liftSolid, useAttributes } from "https://esm.sh/@lift-html/solid";
  import { createSignal, createEffect } from "https://esm.sh/solid-js";
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
npm install @lift-html/core
# or
npm install @lift-html/solid
```

```javascript
// vite.config.js
export default {
  // Your existing Vite config
  // Lift HTML works out of the box
};
```

### Webpack

```bash
npm install @lift-html/core
# or
npm install @lift-html/solid
```

```javascript
// webpack.config.js
module.exports = {
  // Your existing Webpack config
  // Lift HTML works out of the box
};
```

### Create React App

```bash
npm install @lift-html/core
# or
npm install @lift-html/solid
```

```javascript
// You can use Lift HTML components alongside React components
import { liftHtml } from "@lift-html/core";
// or
import { liftSolid } from "@lift-html/solid";
```

### Next.js

```bash
npm install @lift-html/core
# or
npm install @lift-html/solid
```

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js config
  // Lift HTML works out of the box
};

module.exports = nextConfig;
```

## Verification

To verify your installation, create a simple test:

### Using @lift-html/core

```javascript
import { liftHtml } from "@lift-html/core";

const TestComponent = liftHtml("test-component", {
  init() {
    this.textContent = "Hello from Lift HTML Core!";
  },
});
```

### Using @lift-html/solid

```javascript
import { liftSolid } from "@lift-html/solid";
import { createSignal } from "solid-js";

const TestComponent = liftSolid("test-component", {
  init() {
    const [count, setCount] = createSignal(0);
    this.textContent = `Hello from Lift HTML Solid! Count: ${count()}`;
    this.onclick = () => setCount(count() + 1);
  },
});
```

Then in your HTML:

```html
<test-component></test-component>
```

If you see the expected message in your browser, the installation was successful!

## Next Steps

- [Quick Start](/getting-started/quick-start/) - Build your first component
- [Basic Usage](/guides/basic-usage/) - Learn the fundamentals
- [Components](/guides/components/) - Create reusable components
