---
title: Quick Start
description: Build your first lift-html component in minutes
---

# Quick Start

Get up and running with Lift HTML in just a few minutes. This guide will walk you through creating your first component using both the core and solid packages.

## Your First Component

Let's create a simple counter component to demonstrate the basics of Lift HTML. We'll show you how to build it with both `@lift-html/core` and `@lift-html/solid`.

### Using @lift-html/core

Create a new file called `counter.js`:

```javascript
import { liftHtml } from "@lift-html/core";

const Counter = liftHtml("my-counter", {
  observedAttributes: ["initial"],
  init() {
    const button = this.querySelector("button");
    if (!button) throw new Error("<my-counter> must contain a <button>");
    
    // Get initial value from attribute or default to 0
    let count = parseInt(this.getAttribute("initial") || "0");
    
    // Update button text
    const updateCount = () => {
      button.textContent = `Clicks: ${count}`;
    };
    
    // Set up click handler
    button.onclick = () => {
      count++;
      updateCount();
    };
    
    // Initialize
    updateCount();
  },
});
```

### Using @lift-html/solid

Create a new file called `counter-solid.js`:

```javascript
import { liftSolid } from "@lift-html/solid";
import { createSignal, createEffect } from "solid-js";

const Counter = liftSolid("my-counter", {
  observedAttributes: ["initial"],
  init() {
    const button = this.querySelector("button");
    if (!button) throw new Error("<my-counter> must contain a <button>");
    
    // Create reactive signal
    const [count, setCount] = createSignal(
      parseInt(this.getAttribute("initial") || "0")
    );
    
    // Set up click handler
    button.onclick = () => setCount(count() + 1);
    
    // Reactive effect to update button text
    createEffect(() => {
      button.textContent = `Clicks: ${count()}`;
    });
  },
});
```

### 2. Use the Component

In your HTML file:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lift HTML Counter</title>
    <style>
      .counter {
        text-align: center;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        max-width: 300px;
        margin: 20px auto;
      }

      button {
        margin: 0 5px;
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background: #007bff;
        color: white;
        cursor: pointer;
      }

      button:hover {
        background: #0056b3;
      }
    </style>
  </head>
  <body>
    <h1>Lift HTML Quick Start</h1>

    <!-- Use the component -->
    <my-counter initial="5">
      <button disabled>Loading...</button>
    </my-counter>
    
    <my-counter initial="10">
      <button disabled>Loading...</button>
    </my-counter>

    <!-- Choose one of these script tags based on your approach -->
    <script type="module" src="./counter.js"></script>
    <!-- OR -->
    <!-- <script type="module" src="./counter-solid.js"></script> -->
  </body>
</html>
```

### 3. Run Your Application

If you're using a local development server:

```bash
# Using Python (if available)
python -m http.server 8000

# Using Node.js with npx
npx serve .

# Using PHP (if available)
php -S localhost:8000
```

Open your browser and navigate to `http://localhost:8000` to see your counter component in action!

## What Just Happened?

Let's break down the key concepts:

### Component Definition

```javascript
const Counter = liftHtml("my-counter", {
  observedAttributes: ["initial"],  // Attributes to watch for changes
  init() {                          // Called when element connects to DOM
    // Component logic here
  },
});
```

### Key Features Demonstrated

- **HTML Web Components**: The component enhances existing HTML rather than rendering it
- **Attribute Observation**: The `observedAttributes` array tells the component which attributes to watch
- **DOM Enhancement**: We find and enhance the existing `<button>` element
- **Event Handling**: Direct DOM event handling with `onclick`
- **Reactive Updates**: With solid, `createEffect` automatically updates the UI when state changes

### Multiple Instances

Notice how you can use multiple instances of the same component:

```html
<my-counter initial="5">
  <button disabled>Loading...</button>
</my-counter>
<my-counter initial="10">
  <button disabled>Loading...</button>
</my-counter>
```

Each instance maintains its own state independently.

## TypeScript Support

For better type safety, you can add TypeScript declarations:

```typescript
// For @lift-html/core
declare module "@lift-html/core" {
  interface KnownElements {
    "my-counter": typeof Counter;
  }
}

// For @lift-html/solid
declare module "@lift-html/solid" {
  interface KnownElements {
    "my-counter": typeof Counter;
  }
}
```

## CDN Version

For quick prototyping, you can use the CDN version:

### Core Version
```html
<script type="module">
  import { liftHtml } from "https://esm.sh/@lift-html/core";
  
  liftHtml("my-counter", {
    init() {
      const button = this.querySelector("button");
      if (!button) throw new Error("<my-counter> must contain a <button>");
      
      let count = 0;
      button.onclick = () => {
        count++;
        button.textContent = `Clicks: ${count}`;
      };
      button.textContent = `Clicks: ${count}`;
    },
  });
</script>
```

### Solid Version
```html
<script type="module">
  import { liftSolid } from "https://esm.sh/@lift-html/solid";
  import { createSignal, createEffect } from "https://esm.sh/solid-js";
  
  liftSolid("my-counter", {
    init() {
      const button = this.querySelector("button");
      if (!button) throw new Error("<my-counter> must contain a <button>");
      
      const [count, setCount] = createSignal(0);
      button.onclick = () => setCount(count() + 1);
      createEffect(() => {
        button.textContent = `Clicks: ${count()}`;
      });
    },
  });
</script>
```

## Next Steps

Now that you've built your first component, explore more advanced features:

- [Basic Usage](/guides/basic-usage/) - Learn about props, events, and lifecycle
- [Components](/guides/components/) - Build more complex components
- [Interoperability](/guides/interoperability/) - Use Lift HTML with other frameworks

## Troubleshooting

### Common Issues

**Component not rendering?**

- Make sure your HTML contains the expected elements (like `<button>` in our example)
- Check that the script is loaded as a module (`type="module"`)

**Attributes not working?**

- Verify the attribute name is in the `observedAttributes` array
- Check that the attribute value is being read correctly with `getAttribute()`

**Events not firing?**

- Ensure you're setting up event handlers correctly (e.g., `button.onclick`)
- Check that the element exists before adding event listeners

**Solid effects not working?**

- Make sure you're using `createEffect` inside the `init` function
- Verify that you're calling the signal setter (e.g., `setCount`) to trigger updates

Need help? Check out the [GitHub repository](https://github.com/JLarky/lift-html) or open an issue!
