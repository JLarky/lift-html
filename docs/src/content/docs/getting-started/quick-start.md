---
title: Quick Start
description: Build your first lift-html component in minutes
---

# Quick Start

Get up and running with Lift HTML in just a few minutes. This guide will walk
you through creating your first component.

## Your First Component

Let's create a simple counter component to demonstrate the basics of Lift HTML.

### 1. Create the Component

Create a new file called `counter.js`:

```javascript
import { defineComponent } from "lift-html";

const Counter = defineComponent({
  name: "my-counter",

  props: {
    initial: { type: Number, default: 0 },
  },

  data() {
    return {
      count: this.initial,
    };
  },

  template: `
    <div class="counter">
      <h3>Counter: {{ count }}</h3>
      <button @click="increment">+</button>
      <button @click="decrement">-</button>
      <button @click="reset">Reset</button>
    </div>
  `,

  methods: {
    increment() {
      this.count++;
    },

    decrement() {
      this.count--;
    },

    reset() {
      this.count = this.initial;
    },
  },
});

// Register the component
Counter.register();
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
    <my-counter initial="5"></my-counter>
    <my-counter initial="10"></my-counter>

    <script type="module" src="./counter.js"></script>
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

Open your browser and navigate to `http://localhost:8000` to see your counter
component in action!

## What Just Happened?

Let's break down the key concepts:

### Component Definition

```javascript
const Counter = defineComponent({
  name: 'my-counter',        // Custom element name
  props: { ... },           // Component properties
  data() { ... },           // Component state
  template: `...`,          // HTML template
  methods: { ... }          // Component methods
});
```

### Key Features Demonstrated

- **Props**: The `initial` prop allows you to set the starting count
- **Reactive Data**: The `count` data property automatically updates the UI
- **Event Handling**: `@click` directives handle user interactions
- **Template Syntax**: `{{ count }}` displays reactive data
- **Methods**: Component logic is organized in methods

### Multiple Instances

Notice how you can use multiple instances of the same component:

```html
<my-counter initial="5"></my-counter>
<my-counter initial="10"></my-counter>
```

Each instance maintains its own state independently.

## Next Steps

Now that you've built your first component, explore more advanced features:

- [Basic Usage](/guides/basic-usage/) - Learn about props, events, and lifecycle
- [Components](/guides/components/) - Build more complex components
- [Interoperability](/guides/interoperability/) - Use Lift HTML with other
  frameworks

## Troubleshooting

### Common Issues

**Component not rendering?**

- Make sure you called `Counter.register()`
- Check that the script is loaded as a module (`type="module"`)

**Props not working?**

- Verify the prop name matches exactly (case-sensitive)
- Check that the prop type is correct

**Events not firing?**

- Ensure the event name is correct (e.g., `@click`, not `@onclick`)
- Check that the method name exists in the component

Need help? Check out the
[GitHub repository](https://github.com/JLarky/lift-html) or open an issue!
