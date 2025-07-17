---
title: Basic Usage
description: Learn the fundamental concepts of lift-html components
---

# Basic Usage

This guide covers the fundamental concepts you need to understand when building
components with Lift HTML.

## Component Structure

Every Lift HTML component follows a consistent structure using the `liftHtml` or
`liftSolid` function:

```javascript
import { liftHtml } from "@lift-html/core";

const MyComponent = liftHtml("my-component", {
  observedAttributes: ["name", "age"], // Attributes to watch
  init() {
    // Component initialization logic
    // This runs when the element connects to the DOM
  },
});
```

Or with SolidJS integration:

```javascript
import { liftSolid } from "@lift-html/solid";
import { createEffect, createSignal } from "solid-js";

const MyComponent = liftSolid("my-component", {
  observedAttributes: ["name", "age"],
  init() {
    // Component initialization with reactive primitives
    const [count, setCount] = createSignal(0);
    createEffect(() => {
      // Reactive updates
    });
  },
});
```

## HTML Web Components Philosophy

Lift HTML follows the HTML Web Components pattern, which means:

1. **HTML is rendered on the server** - Your components enhance existing HTML
   rather than rendering it
2. **Progressive enhancement** - Components add interactivity to static HTML
3. **No shadow DOM by default** - Components work with the existing DOM
   structure

Example HTML structure:

```html
<my-counter initial="5">
  <button disabled>Loading...</button>
</my-counter>
```

The component enhances the existing `<button>` element rather than creating new
HTML.

## Attributes and Props

In Lift HTML, you work with HTML attributes rather than framework-specific
props. Use `observedAttributes` to watch for attribute changes.

### Basic Attributes

```javascript
const UserCard = liftHtml("user-card", {
  observedAttributes: ["name", "age", "is-active"],
  init() {
    // Read initial attributes
    const name = this.getAttribute("name") || "Unknown";
    const age = parseInt(this.getAttribute("age") || "0");
    const isActive = this.hasAttribute("is-active");

    // Update the component based on attributes
    this.querySelector("h3").textContent = name;
    this.querySelector(".age").textContent = `Age: ${age}`;
    this.querySelector(".status").textContent = isActive
      ? "Active"
      : "Inactive";
  },
});
```

### Using Attributes

```html
<user-card name="John Doe" age="25" is-active></user-card>
<user-card name="Jane Smith" age="30"></user-card>
```

### Reactive Attributes with Solid

```javascript
import { liftSolid, useAttributes } from "@lift-html/solid";
import { createEffect } from "solid-js";

const UserCard = liftSolid("user-card", {
  observedAttributes: ["name", "age", "is-active"],
  init() {
    const props = useAttributes(this);

    createEffect(() => {
      const name = props.name || "Unknown";
      const age = props.age || "0";
      const isActive = props["is-active"] !== null;

      this.querySelector("h3").textContent = name;
      this.querySelector(".age").textContent = `Age: ${age}`;
      this.querySelector(".status").textContent = isActive
        ? "Active"
        : "Inactive";
    });
  },
});
```

## State Management

### Core Package - Manual State

With the core package, you manage state manually:

```javascript
const Counter = liftHtml("my-counter", {
  observedAttributes: ["initial"],
  init() {
    const button = this.querySelector("button");
    if (!button) return;

    // Manual state management
    let count = parseInt(this.getAttribute("initial") || "0");

    const updateDisplay = () => {
      button.textContent = `Count: ${count}`;
    };

    button.onclick = () => {
      count++;
      updateDisplay();
    };

    updateDisplay();
  },
});
```

### Solid Package - Reactive State

With the solid package, you get reactive state management:

```javascript
import { liftSolid } from "@lift-html/solid";
import { createEffect, createSignal } from "solid-js";

const Counter = liftSolid("my-counter", {
  observedAttributes: ["initial"],
  init() {
    const button = this.querySelector("button");
    if (!button) return;

    // Reactive state
    const [count, setCount] = createSignal(
      parseInt(this.getAttribute("initial") || "0"),
    );

    // Reactive effect
    createEffect(() => {
      button.textContent = `Count: ${count()}`;
    });

    button.onclick = () => setCount(count() + 1);
  },
});
```

## Event Handling

Lift HTML uses standard DOM event handling:

```javascript
const TodoList = liftHtml("todo-list", {
  init() {
    const input = this.querySelector("input");
    const addButton = this.querySelector(".add-btn");
    const list = this.querySelector("ul");

    let todos = [];

    const addTodo = () => {
      const text = input.value.trim();
      if (text) {
        todos.push({ id: Date.now(), text, completed: false });
        input.value = "";
        renderTodos();
      }
    };

    const removeTodo = (id) => {
      todos = todos.filter((todo) => todo.id !== id);
      renderTodos();
    };

    const renderTodos = () => {
      list.innerHTML = todos.map((todo) => `
        <li>
          ${todo.text}
          <button onclick="this.closest('todo-list').removeTodo(${todo.id})">
            Delete
          </button>
        </li>
      `).join("");
    };

    // Event listeners
    addButton.onclick = addTodo;
    input.onkeyup = (e) => {
      if (e.key === "Enter") addTodo();
    };

    // Expose methods to global scope for inline event handlers
    this.removeTodo = removeTodo;
  },
});
```

## Lifecycle

Lift HTML provides a simple lifecycle with the `init` function:

```javascript
const MyComponent = liftHtml("my-component", {
  init(deInit) {
    // Component is connected to DOM

    // Set up event listeners
    const button = this.querySelector("button");
    const handler = () => console.log("clicked");
    button.addEventListener("click", handler);

    // Clean up when component is disconnected
    deInit(() => {
      button.removeEventListener("click", handler);
    });
  },
});
```

## Working with DOM

Since Lift HTML enhances existing HTML, you'll often work directly with the DOM:

```javascript
const SearchBox = liftHtml("search-box", {
  observedAttributes: ["placeholder"],
  init() {
    const input = this.querySelector("input");
    const results = this.querySelector(".results");

    if (!input || !results) return;

    // Set placeholder from attribute
    input.placeholder = this.getAttribute("placeholder") || "Search...";

    let searchTimeout;

    input.oninput = (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value;

      searchTimeout = setTimeout(async () => {
        if (query.length < 2) {
          results.innerHTML = "";
          return;
        }

        // Simulate search
        const searchResults = await searchAPI(query);
        results.innerHTML = searchResults.map((item) =>
          `<div class="result">${item.name}</div>`
        ).join("");
      }, 300);
    };
  },
});
```

## TypeScript Support

Lift HTML provides excellent TypeScript support:

```typescript
import { liftHtml } from "@lift-html/core";

const MyComponent = liftHtml("my-component", {
  observedAttributes: ["name", "count"] as const,
  init() {
    // TypeScript knows about observed attributes
    const name = this.getAttribute("name"); // string | null
    const count = this.getAttribute("count"); // string | null
  },
});

// Declare component types for better IDE support
declare module "@lift-html/core" {
  interface KnownElements {
    "my-component": typeof MyComponent;
  }
}
```

## Form Association

Lift HTML supports form-associated custom elements:

```javascript
const CustomInput = liftHtml("custom-input", {
  formAssociated: true,
  observedAttributes: ["value"],
  init() {
    const input = this.querySelector("input");
    if (!input) return;

    // Form association
    this.internals = this.attachInternals();

    input.oninput = (e) => {
      this.internals.setFormValue(e.target.value);
      this.setAttribute("value", e.target.value);
    };
  },
});
```

## Next Steps

- [Components](/guides/components/) - Build more complex components
- [Interoperability](/guides/interoperability/) - Use Lift HTML with other
  frameworks
- [Examples](/guides/example/) - See more examples
