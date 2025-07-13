---
title: Interoperability
description: Use lift-html with other frameworks and libraries
---

# Interoperability

Lift HTML is designed to work seamlessly with existing frameworks and libraries.
This guide shows you how to integrate Lift HTML components with React, Vue,
Angular, and other popular tools.

## Framework Integration

### React Integration

Lift HTML components can be used directly in React applications.

```jsx
// React component using Lift HTML
import React, { useEffect, useRef } from "react";
import { defineComponent } from "lift-html";

// Define a Lift HTML component
const Counter = defineComponent({
  name: "lift-counter",

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
      <h3>Count: {{ count }}</h3>
      <button @click="increment">+</button>
      <button @click="decrement">-</button>
      <button @click="reset">Reset</button>
    </div>
  `,

  methods: {
    increment() {
      this.count++;
      this.$emit("change", this.count);
    },

    decrement() {
      this.count--;
      this.$emit("change", this.count);
    },

    reset() {
      this.count = this.initial;
      this.$emit("change", this.count);
    },
  },
});

// Register the component
Counter.register();

// React wrapper component
const LiftCounter = ({ initial = 0, onChange }) => {
  const counterRef = useRef(null);

  useEffect(() => {
    if (counterRef.current) {
      const counter = counterRef.current;

      // Listen for changes
      counter.addEventListener("change", (event) => {
        onChange?.(event.detail);
      });
    }
  }, [onChange]);

  return (
    <div>
      <lift-counter
        ref={counterRef}
        initial={initial}
      />
    </div>
  );
};

// Usage in React app
function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>React + Lift HTML</h1>
      <LiftCounter
        initial={5}
        onChange={setCount}
      />
      <p>React state: {count}</p>
    </div>
  );
}
```

### Vue.js Integration

Lift HTML components work naturally with Vue.js.

```javascript
// Vue.js component using Lift HTML
import { defineComponent } from "lift-html";

const DataTable = defineComponent({
  name: "lift-data-table",

  props: {
    data: { type: Array, default: () => [] },
    columns: { type: Array, default: () => [] },
  },

  template: `
    <div class="data-table">
      <table>
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in data" :key="row.id">
            <td v-for="column in columns" :key="column.key">
              {{ row[column.key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
});

DataTable.register();
```

```vue
<!-- Vue.js component -->
<template>
  <div>
    <h2>Vue + Lift HTML</h2>
    <lift-data-table 
      :data="tableData" 
      :columns="tableColumns"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { id: 1, name: 'John', email: 'john@example.com' },
        { id: 2, name: 'Jane', email: 'jane@example.com' }
      ],
      tableColumns: [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' }
      ]
    };
  }
};
</script>
```

### Angular Integration

Use Lift HTML components in Angular applications.

```typescript
// Angular component using Lift HTML
import { Component, ElementRef, OnInit } from "@angular/core";
import { defineComponent } from "lift-html";

const Chart = defineComponent({
  name: "lift-chart",

  props: {
    data: { type: Array, default: () => [] },
    type: { type: String, default: "bar" },
  },

  template: `
    <div class="chart">
      <canvas ref="chartCanvas"></canvas>
    </div>
  `,

  mounted() {
    this.renderChart();
  },

  methods: {
    renderChart() {
      const canvas = this.$refs.chartCanvas;
      const ctx = canvas.getContext("2d");

      // Chart rendering logic
      // This is a simplified example
      ctx.fillStyle = "#007bff";
      this.data.forEach((item, index) => {
        ctx.fillRect(index * 50, 100 - item.value, 40, item.value);
      });
    },
  },

  watch: {
    data() {
      this.renderChart();
    },
  },
});

Chart.register();

@Component({
  selector: "app-chart",
  template: `
    <div>
      <h3>Angular + Lift HTML Chart</h3>
      <lift-chart 
        [data]="chartData" 
        type="bar"
      ></lift-chart>
    </div>
  `,
})
export class ChartComponent implements OnInit {
  chartData = [
    { label: "A", value: 10 },
    { label: "B", value: 20 },
    { label: "C", value: 15 },
  ];

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    // Angular lifecycle management
  }
}
```

## Library Integration

### State Management (Redux, Zustand, etc.)

```javascript
// Lift HTML component with Redux integration
import { defineComponent } from "lift-html";
import { store } from "./store.js";

const TodoList = defineComponent({
  name: "lift-todo-list",

  data() {
    return {
      todos: [],
      newTodo: "",
    };
  },

  template: `
    <div class="todo-list">
      <input 
        v-model="newTodo" 
        @keyup.enter="addTodo"
        placeholder="Add a new todo"
      />
      <button @click="addTodo">Add</button>
      
      <ul>
        <li v-for="todo in todos" :key="todo.id">
          <input 
            type="checkbox" 
            :checked="todo.completed"
            @change="toggleTodo(todo.id)"
          />
          <span :class="{ completed: todo.completed }">
            {{ todo.text }}
          </span>
          <button @click="removeTodo(todo.id)">Delete</button>
        </li>
      </ul>
    </div>
  `,

  methods: {
    addTodo() {
      if (this.newTodo.trim()) {
        const todo = {
          id: Date.now(),
          text: this.newTodo,
          completed: false,
        };

        // Dispatch to Redux store
        store.dispatch({ type: "ADD_TODO", payload: todo });
        this.newTodo = "";
      }
    },

    toggleTodo(id) {
      store.dispatch({ type: "TOGGLE_TODO", payload: id });
    },

    removeTodo(id) {
      store.dispatch({ type: "REMOVE_TODO", payload: id });
    },
  },

  mounted() {
    // Subscribe to store changes
    this.unsubscribe = store.subscribe(() => {
      this.todos = store.getState().todos;
    });

    // Initial load
    this.todos = store.getState().todos;
  },

  destroyed() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
});
```

### UI Libraries (Material-UI, Ant Design, etc.)

```javascript
// Lift HTML component styled with Material-UI classes
import { defineComponent } from "lift-html";

const MaterialButton = defineComponent({
  name: "material-button",

  props: {
    variant: { type: String, default: "contained" },
    color: { type: String, default: "primary" },
    disabled: { type: Boolean, default: false },
  },

  template: `
    <button 
      class="MuiButton-root MuiButton-{{ variant }} MuiButton-color{{ color }}"
      :disabled="disabled"
      @click="$emit('click')"
    >
      <slot></slot>
    </button>
  `,
});

const MaterialCard = defineComponent({
  name: "material-card",

  props: {
    elevation: { type: Number, default: 1 },
  },

  template: `
    <div class="MuiPaper-root MuiPaper-elevation{{ elevation }} MuiCard-root">
      <div class="MuiCardContent-root">
        <slot></slot>
      </div>
    </div>
  `,
});

// Usage
const UserCard = defineComponent({
  name: "user-card",

  props: {
    user: { type: Object, required: true },
  },

  template: `
    <material-card elevation="2">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <material-button 
        variant="contained" 
        color="primary"
        @click="editUser"
      >
        Edit
      </material-button>
    </material-card>
  `,

  methods: {
    editUser() {
      this.$emit("edit", this.user);
    },
  },
});
```

### Form Libraries (Formik, React Hook Form, etc.)

```javascript
// Lift HTML component with Formik integration
import { defineComponent } from "lift-html";

const FormField = defineComponent({
  name: "form-field",

  props: {
    name: { type: String, required: true },
    label: { type: String, default: "" },
    type: { type: String, default: "text" },
    value: { type: String, default: "" },
    error: { type: String, default: "" },
  },

  template: `
    <div class="form-field">
      <label v-if="label">{{ label }}</label>
      <input
        :type="type"
        :name="name"
        :value="value"
        @input="handleInput"
        @blur="handleBlur"
        :class="{ error: error }"
      />
      <span v-if="error" class="error-message">{{ error }}</span>
    </div>
  `,

  methods: {
    handleInput(event) {
      this.$emit("input", event.target.value);
    },

    handleBlur(event) {
      this.$emit("blur", event);
    },
  },
});

// React component using Lift HTML with Formik
const FormikForm = () => {
  return (
    <Formik
      initialValues={{ name: "", email: "" }}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ values, handleChange, handleBlur, errors, touched }) => (
        <form>
          <form-field
            name="name"
            label="Name"
            value={values.name}
            error={touched.name && errors.name}
            onInput={handleChange}
            onBlur={handleBlur}
          />
          <form-field
            name="email"
            label="Email"
            type="email"
            value={values.email}
            error={touched.email && errors.email}
            onInput={handleChange}
            onBlur={handleBlur}
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </Formik>
  );
};
```

## Build Tool Integration

### Vite Integration

```javascript
// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  // Vite automatically handles ES modules
  // Lift HTML components work out of the box
  optimizeDeps: {
    include: ["lift-html"],
  },
});
```

### Webpack Integration

```javascript
// webpack.config.js
module.exports = {
  // Webpack handles ES modules automatically
  // No special configuration needed for Lift HTML
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
```

### TypeScript Integration

```typescript
// types/lift-html.d.ts
declare module "lift-html" {
  export interface ComponentOptions {
    name: string;
    props?: Record<string, any>;
    data?: () => Record<string, any>;
    template?: string;
    methods?: Record<string, Function>;
    lifecycle?: {
      created?: () => void;
      mounted?: () => void;
      updated?: () => void;
      destroyed?: () => void;
    };
  }

  export function defineComponent(options: ComponentOptions): any;
}

// Usage with TypeScript
import { defineComponent } from "lift-html";

interface User {
  id: number;
  name: string;
  email: string;
}

const UserCard = defineComponent({
  name: "user-card",

  props: {
    user: { type: Object as () => User, required: true },
  },

  template: `
    <div class="user-card">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
    </div>
  `,
});
```

## Best Practices

### Component Design for Interoperability

1. **Use Standard Web APIs**: Leverage native browser APIs for better
   compatibility
2. **Emit Standard Events**: Use custom events that frameworks can easily listen
   to
3. **Avoid Framework-Specific Code**: Keep components framework-agnostic
4. **Provide Clear Interfaces**: Use well-defined props and events

### Performance

```javascript
// Lazy load components for better performance
const LazyComponent = defineComponent({
  name: "lazy-component",

  data() {
    return {
      Component: null,
      loading: false,
    };
  },

  async mounted() {
    this.loading = true;
    const module = await import("./HeavyComponent.js");
    this.Component = module.default;
    this.loading = false;
  },

  template: `
    <div>
      <div v-if="loading">Loading...</div>
      <Component v-else />
    </div>
  `,
});
```

### Error Boundaries

```javascript
// Error boundary component
const ErrorBoundary = defineComponent({
  name: "error-boundary",

  data() {
    return {
      hasError: false,
      error: null,
    };
  },

  template: `
    <div>
      <div v-if="hasError" class="error-boundary">
        <h3>Something went wrong</h3>
        <p>{{ error?.message }}</p>
        <button @click="reset">Try again</button>
      </div>
      <slot v-else></slot>
    </div>
  `,

  methods: {
    reset() {
      this.hasError = false;
      this.error = null;
    },
  },

  mounted() {
    // Global error handler
    window.addEventListener("error", (event) => {
      this.hasError = true;
      this.error = event.error;
    });
  },
});
```

## Next Steps

- [Best Practices](/guides/best-practices/) - Learn advanced patterns and
  optimization
- [Testing](/guides/testing/) - Test your components effectively
- [Deployment](/guides/deployment/) - Deploy your applications
