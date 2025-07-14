---
title: Components
description: Build complex, reusable components with lift-html
---

# Components

Learn how to build sophisticated, reusable components with Lift HTML. This guide
covers component composition, slots, events, and advanced patterns.

## Component Composition

Components can be composed together to build complex UIs. Here's how to create
and use nested components.

### Basic Composition

```javascript
// Button component
const Button = defineComponent({
  name: "my-button",

  props: {
    variant: { type: String, default: "primary" },
    disabled: { type: Boolean, default: false },
  },

  template: `
    <button 
      class="btn btn-{{ variant }}" 
      :disabled="disabled"
      @click="$emit('click')"
    >
      <slot></slot>
    </button>
  `,
});

// Card component
const Card = defineComponent({
  name: "my-card",

  props: {
    title: { type: String, default: "" },
    padding: { type: String, default: "medium" },
  },

  template: `
    <div class="card card-padding-{{ padding }}">
      <div v-if="title" class="card-header">
        <h3>{{ title }}</h3>
      </div>
      <div class="card-body">
        <slot></slot>
      </div>
    </div>
  `,
});

// User profile component using composition
const UserProfile = defineComponent({
  name: "user-profile",

  props: {
    user: { type: Object, required: true },
  },

  template: `
    <my-card title="User Profile">
      <div class="user-info">
        <h4>{{ user.name }}</h4>
        <p>{{ user.email }}</p>
        <p>Member since: {{ user.joinDate }}</p>
        
        <div class="actions">
          <my-button @click="editProfile">Edit Profile</my-button>
          <my-button variant="danger" @click="deleteProfile">Delete</my-button>
        </div>
      </div>
    </my-card>
  `,

  methods: {
    editProfile() {
      this.$emit("edit", this.user);
    },

    deleteProfile() {
      this.$emit("delete", this.user);
    },
  },
});
```

## Slots

Slots allow you to pass content into components, making them more flexible and
reusable.

### Default Slots

```javascript
const Modal = defineComponent({
  name: "my-modal",

  props: {
    title: { type: String, default: "" },
    visible: { type: Boolean, default: false },
  },

  template: `
    <div v-if="visible" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <button @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
      </div>
    </div>
  `,

  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
});
```

### Named Slots

```javascript
const Layout = defineComponent({
  name: "my-layout",

  template: `
    <div class="layout">
      <header class="header">
        <slot name="header">Default Header</slot>
      </header>
      
      <main class="main">
        <aside class="sidebar">
          <slot name="sidebar">Default Sidebar</slot>
        </aside>
        
        <div class="content">
          <slot name="content">Default Content</slot>
        </div>
      </main>
      
      <footer class="footer">
        <slot name="footer">Default Footer</slot>
      </footer>
    </div>
  `,
});
```

### Using Named Slots

```html
<my-layout>
  <template #header>
    <h1>My Application</h1>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </template>

  <template #sidebar>
    <ul>
      <li><a href="/dashboard">Dashboard</a></li>
      <li><a href="/settings">Settings</a></li>
    </ul>
  </template>

  <template #content>
    <h2>Welcome to the application!</h2>
    <p>This is the main content area.</p>
  </template>

  <template #footer>
    <p>&copy; 2024 My Application</p>
  </template>
</my-layout>
```

## Events and Communication

Components communicate through events. Here's how to emit and handle events.

### Emitting Events

```javascript
const FormInput = defineComponent({
  name: "form-input",

  props: {
    value: { type: String, default: "" },
    placeholder: { type: String, default: "" },
    type: { type: String, default: "text" },
  },

  data() {
    return {
      internalValue: this.value,
    };
  },

  template: `
    <div class="form-input">
      <input
        :type="type"
        :placeholder="placeholder"
        :value="internalValue"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
    </div>
  `,

  methods: {
    handleInput(event) {
      this.internalValue = event.target.value;
      this.$emit("input", this.internalValue);
      this.$emit("change", this.internalValue);
    },

    handleBlur(event) {
      this.$emit("blur", event);
    },

    handleFocus(event) {
      this.$emit("focus", event);
    },
  },

  watch: {
    value(newValue) {
      this.internalValue = newValue;
    },
  },
});
```

### Handling Events

```javascript
const ContactForm = defineComponent({
  name: "contact-form",

  data() {
    return {
      formData: {
        name: "",
        email: "",
        message: "",
      },
      errors: {},
    };
  },

  template: `
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Name:</label>
        <form-input
          v-model="formData.name"
          placeholder="Enter your name"
          @blur="validateField('name')"
        />
        <span v-if="errors.name" class="error">{{ errors.name }}</span>
      </div>
      
      <div class="form-group">
        <label>Email:</label>
        <form-input
          type="email"
          v-model="formData.email"
          placeholder="Enter your email"
          @blur="validateField('email')"
        />
        <span v-if="errors.email" class="error">{{ errors.email }}</span>
      </div>
      
      <div class="form-group">
        <label>Message:</label>
        <textarea
          v-model="formData.message"
          placeholder="Enter your message"
          @blur="validateField('message')"
        ></textarea>
        <span v-if="errors.message" class="error">{{ errors.message }}</span>
      </div>
      
      <button type="submit">Send Message</button>
    </form>
  `,

  methods: {
    validateField(field) {
      const value = this.formData[field];

      switch (field) {
        case "name":
          if (!value.trim()) {
            this.errors.name = "Name is required";
          } else {
            delete this.errors.name;
          }
          break;

        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!value.trim()) {
            this.errors.email = "Email is required";
          } else if (!emailRegex.test(value)) {
            this.errors.email = "Please enter a valid email";
          } else {
            delete this.errors.email;
          }
          break;

        case "message":
          if (!value.trim()) {
            this.errors.message = "Message is required";
          } else {
            delete this.errors.message;
          }
          break;
      }
    },

    handleSubmit() {
      // Validate all fields
      ["name", "email", "message"].forEach((field) => {
        this.validateField(field);
      });

      // Check if there are any errors
      if (Object.keys(this.errors).length === 0) {
        this.$emit("submit", this.formData);
      }
    },
  },
});
```

## Advanced Patterns

### Higher-Order Components

Create wrapper components that add functionality to other components.

```javascript
// HOC for loading states
function withLoading(Component) {
  return defineComponent({
    name: `${Component.name}-with-loading`,

    props: {
      loading: { type: Boolean, default: false },
      error: { type: String, default: "" },
    },

    template: `
      <div class="with-loading">
        <div v-if="loading" class="loading-spinner">
          Loading...
        </div>
        <div v-else-if="error" class="error-message">
          {{ error }}
        </div>
        <Component v-else v-bind="$props" v-on="$listeners" />
      </div>
    `,

    components: {
      Component,
    },
  });
}

// Usage
const UserListWithLoading = withLoading(UserList);
```

### Render Props Pattern

```javascript
const DataProvider = defineComponent({
  name: "data-provider",

  props: {
    url: { type: String, required: true },
  },

  data() {
    return {
      data: null,
      loading: false,
      error: null,
    };
  },

  template: `
    <div>
      <slot 
        :data="data" 
        :loading="loading" 
        :error="error"
        :refresh="fetchData"
      ></slot>
    </div>
  `,

  methods: {
    async fetchData() {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(this.url);
        this.data = await response.json();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },

  mounted() {
    this.fetchData();
  },
});
```

### Using Render Props

```html
<data-provider url="/api/users">
  <template #default="{ data, loading, error, refresh }">
    <div>
      <button @click="refresh">Refresh</button>

      <div v-if="loading">Loading users...</div>
      <div v-else-if="error">Error: {{ error }}</div>
      <div v-else>
        <h3>Users ({{ data.length }})</h3>
        <ul>
          <li v-for="user in data" :key="user.id">
            {{ user.name }} - {{ user.email }}
          </li>
        </ul>
      </div>
    </div>
  </template>
</data-provider>
```

### Component Libraries

Organize related components into libraries.

```javascript
// components/ui/index.js
import Button from "./Button.js";
import Card from "./Card.js";
import Modal from "./Modal.js";
import FormInput from "./FormInput.js";

export { Button, Card, FormInput, Modal };

// components/forms/index.js
import ContactForm from "./ContactForm.js";
import LoginForm from "./LoginForm.js";
import RegistrationForm from "./RegistrationForm.js";

export { ContactForm, LoginForm, RegistrationForm };

// main.js
import { Button, Card, FormInput, Modal } from "./components/ui/index.js";
import { ContactForm, LoginForm } from "./components/forms/index.js";

// Register all components
[Button, Card, Modal, FormInput, ContactForm, LoginForm].forEach(
  (Component) => {
    Component.register();
  },
);
```

## Best Practices

### Component Design

1. **Single Responsibility**: Each component should have one clear purpose
2. **Props Down, Events Up**: Pass data down via props, emit events up
3. **Composition over Inheritance**: Use slots and composition instead of
   inheritance
4. **Consistent Naming**: Use kebab-case for component names and props

### Performance

```javascript
// Use v-memo for expensive computations
const ExpensiveList = defineComponent({
  name: "expensive-list",

  template: `
    <div>
      <div v-for="item in items" :key="item.id" v-memo="[item.id, item.status]">
        <expensive-item :item="item" />
      </div>
    </div>
  `,
});

// Lazy load components
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

## Next Steps

- [Interoperability](/guides/interoperability/) - Use Lift HTML with other
  frameworks
- [Best Practices](/guides/best-practices/) - Learn advanced patterns and
  optimization
- [Testing](/guides/testing/) - Test your components effectively
