---
title: Basic Usage
description: Learn the fundamental concepts of lift-html components
---

# Basic Usage

This guide covers the fundamental concepts you need to understand when building components with Lift HTML.

## Component Structure

Every Lift HTML component follows a consistent structure:

```javascript
import { defineComponent } from 'lift-html';

const MyComponent = defineComponent({
  name: 'my-component',
  props: { /* component properties */ },
  data() { /* component state */ },
  template: `/* HTML template */`,
  methods: { /* component methods */ },
  lifecycle: { /* lifecycle hooks */ }
});
```

## Props

Props are the way components receive data from their parent. They define the component's interface.

### Basic Props

```javascript
const UserCard = defineComponent({
  name: 'user-card',
  
  props: {
    name: { type: String, required: true },
    age: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false }
  },
  
  template: `
    <div class="user-card">
      <h3>{{ name }}</h3>
      <p>Age: {{ age }}</p>
      <p>Status: {{ isActive ? 'Active' : 'Inactive' }}</p>
    </div>
  `
});
```

### Using Props

```html
<user-card name="John Doe" age="25" is-active></user-card>
<user-card name="Jane Smith" age="30" :is-active="false"></user-card>
```

### Prop Types

Lift HTML supports various prop types:

```javascript
props: {
  // String
  title: { type: String, default: 'Default Title' },
  
  // Number
  count: { type: Number, required: true },
  
  // Boolean
  visible: { type: Boolean, default: true },
  
  // Array
  items: { type: Array, default: () => [] },
  
  // Object
  config: { type: Object, default: () => ({}) },
  
  // Function
  onAction: { type: Function, default: null }
}
```

## Data

The `data()` function returns the component's reactive state. Any changes to data properties will automatically update the template.

```javascript
const Counter = defineComponent({
  name: 'my-counter',
  
  data() {
    return {
      count: 0,
      isLoading: false,
      items: [],
      user: {
        name: '',
        email: ''
      }
    };
  },
  
  template: `
    <div>
      <p>Count: {{ count }}</p>
      <p>Loading: {{ isLoading }}</p>
      <p>Items: {{ items.length }}</p>
      <p>User: {{ user.name }}</p>
    </div>
  `
});
```

## Methods

Methods contain the component's logic and can be called from templates or other methods.

```javascript
const TodoList = defineComponent({
  name: 'todo-list',
  
  data() {
    return {
      todos: [],
      newTodo: ''
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
          {{ todo.text }}
          <button @click="removeTodo(todo.id)">Delete</button>
        </li>
      </ul>
    </div>
  `,
  
  methods: {
    addTodo() {
      if (this.newTodo.trim()) {
        this.todos.push({
          id: Date.now(),
          text: this.newTodo,
          completed: false
        });
        this.newTodo = '';
      }
    },
    
    removeTodo(id) {
      this.todos = this.todos.filter(todo => todo.id !== id);
    },
    
    toggleTodo(id) {
      const todo = this.todos.find(t => t.id === id);
      if (todo) {
        todo.completed = !todo.completed;
      }
    }
  }
});
```

## Template Syntax

Lift HTML uses a simple template syntax for data binding and control flow.

### Text Interpolation

```html
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
    <span>{{ count + 1 }}</span>
  </div>
</template>
```

### Conditional Rendering

```html
<template>
  <div>
    <div v-if="isVisible">This is visible</div>
    <div v-else>This is hidden</div>
    
    <div v-show="isActive">This can be toggled</div>
  </div>
</template>
```

### List Rendering

```html
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
  
  <!-- With index -->
  <ul>
    <li v-for="(item, index) in items" :key="item.id">
      {{ index + 1 }}. {{ item.name }}
    </li>
  </ul>
</template>
```

### Event Handling

```html
<template>
  <div>
    <button @click="handleClick">Click me</button>
    <input @input="handleInput" @keyup.enter="handleEnter" />
    <form @submit.prevent="handleSubmit">
      <!-- form content -->
    </form>
  </div>
</template>
```

### Two-way Data Binding

```html
<template>
  <div>
    <input v-model="message" />
    <textarea v-model="description"></textarea>
    <select v-model="selected">
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
    </select>
  </div>
</template>
```

## Lifecycle Hooks

Lift HTML provides lifecycle hooks to execute code at specific stages of a component's lifecycle.

```javascript
const MyComponent = defineComponent({
  name: 'my-component',
  
  lifecycle: {
    // Called when the component is created
    created() {
      console.log('Component created');
    },
    
    // Called when the component is mounted to the DOM
    mounted() {
      console.log('Component mounted');
      // Good place for DOM manipulation
    },
    
    // Called when the component is updated
    updated() {
      console.log('Component updated');
    },
    
    // Called when the component is destroyed
    destroyed() {
      console.log('Component destroyed');
      // Clean up event listeners, timers, etc.
    }
  }
});
```

## Computed Properties

Computed properties are derived from other data and automatically update when dependencies change.

```javascript
const ShoppingCart = defineComponent({
  name: 'shopping-cart',
  
  data() {
    return {
      items: [
        { name: 'Apple', price: 1.00, quantity: 2 },
        { name: 'Banana', price: 0.50, quantity: 3 },
        { name: 'Orange', price: 1.25, quantity: 1 }
      ]
    };
  },
  
  computed: {
    totalItems() {
      return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    
    totalPrice() {
      return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    
    formattedTotal() {
      return `$${this.totalPrice.toFixed(2)}`;
    }
  },
  
  template: `
    <div class="cart">
      <h3>Shopping Cart</h3>
      <p>Total Items: {{ totalItems }}</p>
      <p>Total Price: {{ formattedTotal }}</p>
    </div>
  `
});
```

## Watchers

Watchers allow you to react to data changes and perform side effects.

```javascript
const SearchComponent = defineComponent({
  name: 'search-component',
  
  data() {
    return {
      query: '',
      results: [],
      isLoading: false
    };
  },
  
  watch: {
    query(newQuery, oldQuery) {
      if (newQuery !== oldQuery) {
        this.debouncedSearch();
      }
    }
  },
  
  methods: {
    debouncedSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.performSearch();
      }, 300);
    },
    
    async performSearch() {
      if (!this.query.trim()) {
        this.results = [];
        return;
      }
      
      this.isLoading = true;
      try {
        // Simulate API call
        const response = await fetch(`/api/search?q=${this.query}`);
        this.results = await response.json();
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
});
```

## Next Steps

Now that you understand the basics, explore more advanced topics:

- [Components](/guides/components/) - Build complex, reusable components
- [Interoperability](/guides/interoperability/) - Use Lift HTML with other frameworks
- [Best Practices](/guides/best-practices/) - Learn component design patterns