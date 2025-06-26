# Usage Guide for lift-html

This guide will help you get started with `lift-html` and its various packages.

## Introduction

`lift-html` is a tiny library for building HTML Web Components. Its philosophy is centered around enhancing existing HTML generated on the server, rather than client-side rendering or hydration. This approach aligns with Progressive Enhancement principles.

`lift-html` offers several packages to suit different needs:

*   `@lift-html/tiny`: A minimal package (around 150 bytes) for type-safe custom element declaration and a simplified API.
*   `@lift-html/core`: Extends `@lift-html/tiny` with HMR support, full web component features like `formAssociated` and `observedAttributes` with type safety, and `init`/`deinit` callbacks (less than 600 bytes).
*   `@lift-html/solid`: Integrates SolidJS for reactive attributes and state management within your components.
*   `@lift-html/alien`: Integrates alien-signals for reactive attributes.
*   `@lift-html/incentive`: Provides an API similar to Hotwire Stimulus or GitHub Catalyst for working with targets inside components.

The core idea is to write HTML, CSS, and JS/TS without feeling like you're writing a heavy "component" in the traditional framework sense.

## Prerequisites

To effectively use `lift-html`, you should be familiar with:

*   **HTML and CSS:** Understanding the basics of web structure and styling.
*   **Modern JavaScript (ES6+):** Concepts like modules, arrow functions, and DOM manipulation are essential.

While `lift-html` components can be used directly in the browser via `esm.sh` without any build tools, the optional `@lift-html/cli` for vendoring requires Deno.

## Getting Started

You can easily include `lift-html` packages in your project using a CDN like `esm.sh`.

Here's how to include `@lift-html/core`:

```html
<script type="module">
  import { liftHtml } from "https://esm.sh/@lift-html/core";
  // Your component code will go here
</script>
```

And for `@lift-html/solid`:

```html
<script type="module">
  import { liftSolid } from "https://esm.sh/@lift-html/solid";
  import { createSignal, createEffect } from "https://esm.sh/solid-js";
  // Your component code will go here
</script>
```

### "Hello World" with `@lift-html/core`

Let's create a simple custom element that displays a message.

```html
<hello-world>
  <p>Loading...</p>
</hello-world>

<script type="module">
  import { liftHtml } from "https://esm.sh/@lift-html/core";

  liftHtml("hello-world", {
    init() {
      const p = this.querySelector("p");
      if (p) {
        p.textContent = "Hello from lift-html!";
      }
    }
  });
</script>
```

## Core Concepts of `@lift-html/core`

### `liftHtml(tagName, definition)`

This is the primary function from `@lift-html/core`.
*   `tagName`: A string representing the name of your custom element (e.g., `"my-component"`).
*   `definition`: An object that defines the behavior of your component.

### `init()`

The `init()` method is a key part of the component definition.
*   **Purpose:** It's called when the element is connected to the DOM (or adopted into a new document). This is the recommended place for DOM access, attaching event listeners, and other setup logic. It's safer than using the `constructor` for DOM operations.
*   `this` inside `init()` refers to the custom element instance.

### Interacting with the Element's DOM

You can use standard DOM APIs within `init()` and other methods:

```html
<click-counter>
  <button>Clicks: 0</button>
</click-counter>

<script type="module">
  import { liftHtml } from "https://esm.sh/@lift-html/core";

  liftHtml("click-counter", {
    init() {
      const button = this.querySelector("button");
      if (!button) return;

      let count = 0;
      button.addEventListener("click", () => {
        count++;
        button.textContent = `Clicks: ${count}`;
      });
    }
  });
</script>
```

### `deinit()`

The `deinit()` method is called when the element is disconnected from the DOM. It's useful for cleanup tasks, like removing event listeners or clearing intervals, to prevent memory leaks.

```javascript
// Inside the component definition object:
// deinit() {
//   console.log(`${this.tagName} is being removed from the DOM.`);
//   // Perform cleanup here
// }
```

## Working with Attributes

### `observedAttributes`

`lift-html` allows you to observe attribute changes similarly to standard Web Components. You define `observedAttributes` as a static property on your definition object. The `attributeChangedCallback(name, oldValue, newValue)` method will then be triggered when any of these attributes change.

However, `lift-html` often encourages a more reactive approach, especially with integrations like SolidJS.

```html
<!-- Example with @lift-html/core -->
<my-profile data-username="Guest"></my-profile>

<script type="module">
  import { liftHtml } from "https://esm.sh/@lift-html/core";

  liftHtml("my-profile", {
    observedAttributes: ["data-username"],
    init() {
      this.updateUsername(this.getAttribute("data-username"));
    },
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "data-username") {
        this.updateUsername(newValue);
      }
    },
    updateUsername(username) {
      this.textContent = `Hello, ${username || 'Guest'}!`;
    }
  });

  // Later, you can change the attribute:
  // document.querySelector("my-profile").setAttribute("data-username", "Alice");
</script>
```

### Reactive Attributes with `@lift-html/solid`

`@lift-html/solid` makes working with attributes and component state reactive using SolidJS primitives.

```html
<user-greeting data-name="World"></user-greeting>

<script type="module">
  import { liftSolid } from "https://esm.sh/@lift-html/solid";
  import { createSignal, createEffect } from "https://esm.sh/solid-js";

  liftSolid("user-greeting", {
    props: {
      name: String, // Define expected prop types
    },
    init({ props }) { // Props are passed to init
      const [greeting, setGreeting] = createSignal(`Hello, ${props.name || 'User'}!`);

      createEffect(() => {
        // Reacts to changes in props.name
        setGreeting(`Hello, ${props.name || 'User'}!`);
      });

      createEffect(() => {
        // Updates the DOM when the greeting signal changes
        this.textContent = greeting();
      });

      // Example of updating the prop from outside:
      // setTimeout(() => {
      //   document.querySelector("user-greeting").setAttribute('data-name', 'SolidJS');
      // }, 2000);
    }
  });
</script>
```
In this example, if the `data-name` attribute on `<user-greeting>` changes, `props.name` will update, triggering the `createEffect` to update the `greeting` signal, which in turn updates the element's text content.

## Hot Module Replacement (HMR)

`lift-html` supports HMR out of the box. When you use `liftHtml` or `liftSolid` to define a component, if a component with the same tag name already exists, its definition (specifically the `init`, `deinit`, and other lifecycle methods) will be updated with the new one. This allows for seamless updates during development without losing the component's state if managed carefully.

For HMR to work with bundlers like Vite or build tools like Astro, you typically need to accept the hot updates in your module:

```javascript
// In your component definition module (e.g., my-component.js)
import { liftHtml } from "@lift-html/core";

liftHtml("my-component", {
  init() {
    console.log("Component V2 initialized!");
    this.textContent = "Updated Component!";
  }
  // ... other lifecycle methods
});

if (import.meta.hot) {
  import.meta.hot.accept();
}
```
This allows the module to be re-evaluated and the component definition to be updated in place.

## Shadow DOM

`lift-html` does not provide any abstraction over the Shadow DOM. You can use it directly as you would with vanilla Web Components. This means `lift-html` works seamlessly with Shadow DOM if you choose to use it.

You can attach a shadow root within the `init()` method:

```html
<shadow-element></shadow-element>

<script type="module">
  import { liftHtml } from "https://esm.sh/@lift-html/core";

  liftHtml("shadow-element", {
    init() {
      // Check if shadowRoot already exists (e.g., during HMR)
      const root = this.shadowRoot || this.attachShadow({ mode: "open" });
      root.innerHTML = `
        <style>
          p { color: blue; }
        </style>
        <p>This is rendered in Shadow DOM!</p>
      `;
    }
  });
</script>
```

## Vendoring with `@lift-html/cli`

For projects that prefer zero dependencies or want to customize the core library, `lift-html` provides a CLI tool for vendoring. Vendoring copies the `lift-html` code directly into your project.

**Benefits:**

*   **Zero-dependency:** No need to rely on external CDNs or npm packages for the core functionality.
*   **Customization:** You can modify the vendored code to remove unused features (like HMR for production builds) or add custom enhancements.

**Command:**

The `deno run -A jsr:@lift-html/cli <output-path>` command vendors the `@lift-html/core` package. This means it copies the source code of `@lift-html/core` into your project at the specified `<output-path>`.

For example, to vendor `@lift-html/core` into a file named `my-lift-html-core.js` in the current directory, you would run:

```bash
deno run -A jsr:@lift-html/cli ./my-lift-html-core.js
```

**Usage:**

*   The `<output-path>` (e.g., `./my-lift-html-core.js`) is user-definable. You can choose the name and location for the vendored file.
*   The command fetches the latest version of `@lift-html/core` and saves its source code to the specified path.
*   You can then import `liftHtml` directly from this local file in your project.

```javascript
// Assuming you vendored to './my-lift-html-core.js'
import { liftHtml } from './my-lift-html-core.js';

// ... rest of your component code
```

## Choosing the Right Package

*   **`@lift-html/tiny`**: Start here if you only need basic, type-safe custom element definitions and want the absolute smallest footprint. Excellent for enhancing static HTML with minimal JavaScript.
*   **`@lift-html/core`**: The recommended default for most use cases. It adds HMR, full lifecycle support (`init`, `deinit`), and better handling of web component features like `observedAttributes` while still being very lightweight.
*   **`@lift-html/solid` (or `@lift-html/alien`)**: Choose these when you need reactivity for attributes or internal state management. If you're already using SolidJS or prefer its signal-based reactivity, `@lift-html/solid` is a natural fit.
*   **`@lift-html/incentive`**: If you like the "targets" pattern from Stimulus or Catalyst for DOM element references within your component, this package provides that functionality.

You can mix and match these as needed, but generally, you'll pick one primary "lifter" function (`liftTiny`, `liftHtml`, `liftSolid`) per component.

## Further Steps

*   **Explore the Examples:** The `examples/` directory in the `lift-html` repository contains practical examples demonstrating various features and integrations.
*   **Consult the `README.md`:** The main `README.md` provides a higher-level overview, philosophy, and comparisons with other approaches.

Happy lifting!
```
