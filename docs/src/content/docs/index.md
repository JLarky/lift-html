---
title: Introduction
description: Welcome to lift-html documentation
---

# Welcome to Lift HTML

Lift HTML is a tiny library for building HTML Web Components - components that
enhance existing HTML on the page instead of rendering it on the client or
hydrating it.

## What is Lift HTML?

Lift HTML follows the HTML Web Components pattern, which means:

- **HTML is rendered on the server** - Your components enhance existing HTML
  rather than rendering it
- **Progressive enhancement** - Components add interactivity to static HTML
- **Minimal overhead** - Start with as little as 150 bytes gzipped
- **Framework-agnostic** - Works with any existing setup
- **Type-safe** - Full TypeScript support out of the box

## Available Packages

### @lift-html/core

The core package providing the basic `liftHtml` function for creating web
components. Perfect for simple components that don't need reactive state
management.

**Bundle size:** ~600 bytes gzipped

### @lift-html/solid

Includes the core functionality plus SolidJS integration for reactive
components. Provides `liftSolid` function and `useAttributes` helper.

**Bundle size:** ~3.4kb gzipped (includes solid-js)

### @lift-html/tiny

Minimal package for the most basic use cases. Provides just the essential
functionality.

**Bundle size:** ~150 bytes gzipped

## Quick Start

Get started with Lift HTML in just a few steps:

### Using @lift-html/core

```bash
npm install @lift-html/core
```

```javascript
import { liftHtml } from "@lift-html/core";

const MyButton = liftHtml("my-button", {
  init() {
    const button = this.querySelector("button");
    if (!button) throw new Error("<my-button> must contain a <button>");

    let count = 0;
    button.onclick = () => {
      count++;
      button.textContent = `Clicks: ${count}`;
    };
    button.textContent = `Clicks: ${count}`;
  },
});
```

```html
<my-button>
  <button disabled>Loading...</button>
</my-button>
```

### Using @lift-html/solid

```bash
npm install @lift-html/solid
```

```javascript
import { liftSolid } from "@lift-html/solid";
import { createEffect, createSignal } from "solid-js";

const MyButton = liftSolid("my-button", {
  init() {
    const button = this.querySelector("button");
    if (!button) throw new Error("<my-button> must contain a <button>");

    const [count, setCount] = createSignal(0);
    button.onclick = () => setCount(count() + 1);
    createEffect(() => {
      button.textContent = `Clicks: ${count()}`;
    });
  },
});
```

## Key Features

- 🚀 **Tiny** - Start with 150 bytes, scale up as needed
- 🔧 **Framework-agnostic** - Works with any existing setup
- 🎯 **Type-safe** - Full TypeScript support
- 🌐 **Web standards** - Uses native web APIs and standards
- ♻️ **Reactive** - Optional SolidJS integration for reactive state
- 🔥 **HMR support** - Hot Module Replacement out of the box

## Why HTML Web Components?

Traditional web component frameworks often focus on rendering HTML on the client
side. Lift HTML takes a different approach:

- **Server-rendered HTML** - Your HTML is generated on the server, providing
  better SEO and initial load performance
- **Progressive enhancement** - Components add interactivity to existing HTML
  rather than replacing it
- **Better accessibility** - HTML is available immediately, even before
  JavaScript loads
- **Simpler mental model** - You write HTML, then enhance it with JavaScript

## Show me the code

Here's a complete example that works right now:

```html
<my-button>
  <button disabled>
    Loading...
  </button>
</my-button>
<script type="module">
  import { liftSolid } from "https://esm.sh/@lift-html/solid";
  import { createEffect, createSignal } from "https://esm.sh/solid-js";

  const MyButton = liftSolid("my-button", {
    init() {
      const button = this.querySelector("button");
      if (!button) throw new Error("<my-button> must contain a <button>");
      button.disabled = false;
      const [count, setCount] = createSignal(0);
      button.onclick = () => setCount(count() + 1);
      createEffect(() => {
        button.textContent = `Clicks: ${count()}`;
      });
    },
  });
</script>
```

Total code size:
[3.41kb gzip](https://bundlejs.com/?q=https%3A%2F%2Fesm.sh%2F%40lift-html%2Fsolid%2Chttps%3A%2F%2Fesm.sh%2Fsolid-js&treeshake=%5B%7BliftSolid%7D%5D%2C%5B%7BcreateSignal%2CcreateEffect%7D%5D&share=PTAEBMFMDMEsDtKgIagMYFcDOAXA9gLaiQA2kBk8OAUKMQB4AOeATjunvLqALICeAIQw588UAF5QJWNBwBlPNPAAKAEQE%2BAWgBGw0aoA0oAN606oBLBzKAlCbPmOXdrpGcJoHAAtYWAHQAjhiQLHxypJBo%2BCxqrvo2ANwO5jKgygCEcZx23ix4AO6giIUAoix5MaoAPBo6epwAfKAE2OxonDjICCigVVnwDaqJyXT9fuC%2ByNpk4B7QyCRYkEmOdO3OoADa7RhURks4AMJ4uzgAuh5oLJDIOJBysADm8AvKAAzDq6BjnGjSaABrDy2CRNA7HU7KHZUEEAalAAEZPqsrjc7iVoNBItYQeImqYvqN6vA-Hd6EcOpR2JIAAaHf4ArAALlAABJjNDrDYAL40larbnIujcgxmQUJIA)

## Next Steps

- [Installation Guide](/getting-started/installation/) - Set up Lift HTML in
  your project
- [Quick Start](/getting-started/quick-start/) - Build your first component
- [Basic Usage](/guides/basic-usage/) - Learn the fundamentals
- [Components](/guides/components/) - Create reusable components
- [Examples](/guides/example/) - See complete examples
- [Interoperability](/guides/interoperability/) - Work with other frameworks

## Community

- [GitHub Repository](https://github.com/JLarky/lift-html) - Source code and
  issues
- [Live Demo](https://lift-html-solid-demo.netlify.app/) - See it in action
- [Examples](https://github.com/JLarky/lift-html/tree/main/examples) - Code
  examples and demos
