---
title: Example Guide
description: Build a complete interactive component with lift-html
---

# Example: Interactive Counter Component

This guide walks you through building a complete interactive counter component
using Lift HTML. We'll create both a core version and a solid version to show
the differences.

## What We're Building

A counter component that:

- Displays a click count
- Allows incrementing via button clicks
- Supports an initial value via attributes
- Updates the UI reactively
- Handles edge cases gracefully

## HTML Structure

First, let's define the HTML structure that our component will enhance:

```html
<my-counter initial="5">
  <button disabled>
    Loading...
  </button>
</my-counter>
```

Notice that we start with a disabled button showing "Loading..." - this provides
a fallback state before JavaScript loads.

## Core Version

Let's build the counter using `@lift-html/core`:

```javascript
import { liftHtml } from "@lift-html/core";

const MyCounter = liftHtml("my-counter", {
  observedAttributes: ["initial"],
  init() {
    // Find the button element
    const button = this.querySelector("button");
    if (!button) {
      throw new Error("<my-counter> must contain a <button>");
    }

    // Enable the button
    button.disabled = false;

    // Get initial count from attribute or default to 0
    let count = parseInt(this.getAttribute("initial") || "0");

    // Function to update button text
    const updateCount = () => {
      button.textContent = `Clicks: ${count}`;
    };

    // Set up click handler
    button.onclick = () => {
      count++;
      updateCount();
    };

    // Initialize the display
    updateCount();
  },
});
```

### Key Features Explained

1. **Element Selection**: We use `querySelector` to find the button element
2. **Error Handling**: We throw an error if the required button is missing
3. **Attribute Reading**: We read the `initial` attribute and parse it as an
   integer
4. **State Management**: We use a simple variable to track the count
5. **Event Handling**: We set up a click handler to increment the count
6. **UI Updates**: We manually update the button text when the count changes

## Solid Version

Now let's build the same counter using `@lift-html/solid` for reactive state
management:

```javascript
import { liftSolid } from "@lift-html/solid";
import { createEffect, createSignal } from "solid-js";

const MyCounter = liftSolid("my-counter", {
  observedAttributes: ["initial"],
  init() {
    // Find the button element
    const button = this.querySelector("button");
    if (!button) {
      throw new Error("<my-counter> must contain a <button>");
    }

    // Enable the button
    button.disabled = false;

    // Create reactive signal for count
    const [count, setCount] = createSignal(
      parseInt(this.getAttribute("initial") || "0"),
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

### Key Differences from Core Version

1. **Reactive State**: We use `createSignal` instead of a regular variable
2. **Automatic Updates**: `createEffect` automatically updates the UI when the
   signal changes
3. **Cleaner Code**: No need for manual update functions
4. **Better Performance**: Only the text content updates, not the entire button

## TypeScript Support

Add TypeScript declarations for better IDE support:

```typescript
// For core version
declare module "@lift-html/core" {
  interface KnownElements {
    "my-counter": typeof MyCounter;
  }
}

// For solid version
declare module "@lift-html/solid" {
  interface KnownElements {
    "my-counter": typeof MyCounter;
  }
}
```

## Enhanced Version with More Features

Let's add more features to make it a complete component:

```javascript
import { liftSolid } from "@lift-html/solid";
import { createEffect, createSignal } from "solid-js";

const MyCounter = liftSolid("my-counter", {
  observedAttributes: ["initial", "min", "max", "step"],
  init() {
    const button = this.querySelector("button");
    if (!button) {
      throw new Error("<my-counter> must contain a <button>");
    }

    // Get configuration from attributes
    const initial = parseInt(this.getAttribute("initial") || "0");
    const min = parseInt(this.getAttribute("min") || "-Infinity");
    const max = parseInt(this.getAttribute("max") || "Infinity");
    const step = parseInt(this.getAttribute("step") || "1");

    // Create reactive state
    const [count, setCount] = createSignal(initial);

    // Enable the button
    button.disabled = false;

    // Set up click handler with bounds checking
    button.onclick = () => {
      const newCount = count() + step;
      if (newCount >= min && newCount <= max) {
        setCount(newCount);
      }
    };

    // Reactive effects
    createEffect(() => {
      const currentCount = count();

      // Update button text
      button.textContent = `Clicks: ${currentCount}`;

      // Update disabled state based on bounds
      const atMin = currentCount <= min;
      const atMax = currentCount >= max;
      button.disabled = atMin || atMax;

      // Add visual feedback
      if (atMin) {
        button.classList.add("at-min");
      } else {
        button.classList.remove("at-min");
      }

      if (atMax) {
        button.classList.add("at-max");
      } else {
        button.classList.remove("at-max");
      }
    });

    // Emit events for external listeners
    createEffect(() => {
      this.dispatchEvent(
        new CustomEvent("count-change", {
          detail: { count: count() },
          bubbles: true,
        }),
      );
    });
  },
});
```

## Usage Examples

### Basic Usage

```html
<my-counter initial="5">
  <button disabled>Loading...</button>
</my-counter>
```

### With Bounds

```html
<my-counter initial="0" min="0" max="10" step="2">
  <button disabled>Loading...</button>
</my-counter>
```

### Listening for Events

```html
<my-counter initial="0" id="my-counter">
  <button disabled>Loading...</button>
</my-counter>

<script>
  document.getElementById("my-counter").addEventListener(
    "count-change",
    (e) => {
      console.log("Count changed to:", e.detail.count);
    },
  );
</script>
```

## CSS Styling

Add some CSS to make it look good:

```css
my-counter button {
  padding: 10px 20px;
  border: 2px solid #007bff;
  border-radius: 5px;
  background: white;
  color: #007bff;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
}

my-counter button:hover:not(:disabled) {
  background: #007bff;
  color: white;
}

my-counter button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

my-counter button.at-min {
  border-color: #dc3545;
  color: #dc3545;
}

my-counter button.at-max {
  border-color: #28a745;
  color: #28a745;
}
```

## Testing the Component

Create a simple test page:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Counter Component Test</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 50px auto;
        padding: 20px;
      }

      .counter-group {
        margin: 20px 0;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }

      h3 {
        margin-top: 0;
        color: #333;
      }
    </style>
  </head>
  <body>
    <h1>Counter Component Examples</h1>

    <div class="counter-group">
      <h3>Basic Counter</h3>
      <my-counter initial="0">
        <button disabled>Loading...</button>
      </my-counter>
    </div>

    <div class="counter-group">
      <h3>Counter with Initial Value</h3>
      <my-counter initial="5">
        <button disabled>Loading...</button>
      </my-counter>
    </div>

    <div class="counter-group">
      <h3>Bounded Counter (0-10, step 2)</h3>
      <my-counter initial="0" min="0" max="10" step="2">
        <button disabled>Loading...</button>
      </my-counter>
    </div>

    <div class="counter-group">
      <h3>Negative Range Counter</h3>
      <my-counter initial="0" min="-5" max="5" step="1">
        <button disabled>Loading...</button>
      </my-counter>
    </div>

    <script type="module" src="./counter.js"></script>
  </body>
</html>
```

## Key Takeaways

1. **HTML Web Components**: Start with meaningful HTML that works without
   JavaScript
2. **Progressive Enhancement**: Add interactivity to existing elements
3. **Error Handling**: Always check for required elements and provide helpful
   error messages
4. **Reactive State**: Use SolidJS for complex state management
5. **Event Communication**: Use CustomEvents to communicate with parent
   components
6. **Accessibility**: Consider ARIA attributes and keyboard navigation
7. **Styling**: Use CSS for visual feedback and state changes

## Next Steps

- [Basic Usage](/guides/basic-usage/) - Learn more about component fundamentals
- [Components](/guides/components/) - Build more complex components
- [Interoperability](/guides/interoperability/) - Use with other frameworks
