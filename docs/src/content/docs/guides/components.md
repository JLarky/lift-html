---
title: Components
description: Build complex, reusable components with lift-html
---

# Components

Learn how to build sophisticated, reusable components with Lift HTML. This guide
covers component composition, working with existing HTML, events, and advanced
patterns.

## Component Composition

Components can be composed together to build complex UIs. Since Lift HTML
enhances existing HTML, composition happens at the HTML level rather than in
JavaScript.

### Basic Composition

```html
<!-- HTML structure -->
<user-profile user='{"name":"John Doe","email":"john@example.com"}'>
  <my-card title="User Profile">
    <div class="user-info">
      <h4>John Doe</h4>
      <p>john@example.com</p>
      <p>Member since: 2024</p>

      <div class="actions">
        <my-button variant="primary">Edit Profile</my-button>
        <my-button variant="danger">Delete</my-button>
      </div>
    </div>
  </my-card>
</user-profile>
```

```javascript
// Button component
const Button = liftHtml("my-button", {
  observedAttributes: ["variant", "disabled"],
  init() {
    const button = this.querySelector("button");
    if (!button) return;

    // Apply variant class
    const variant = this.getAttribute("variant") || "primary";
    button.className = `btn btn-${variant}`;

    // Handle disabled state
    if (this.hasAttribute("disabled")) {
      button.disabled = true;
    }

    // Handle click events
    button.onclick = (e) => {
      this.dispatchEvent(
        new CustomEvent("click", {
          detail: { originalEvent: e },
          bubbles: true,
        }),
      );
    };
  },
});

// Card component
const Card = liftHtml("my-card", {
  observedAttributes: ["title", "padding"],
  init() {
    const header = this.querySelector(".card-header h3");
    const body = this.querySelector(".card-body");

    if (header) {
      const title = this.getAttribute("title");
      if (title) {
        header.textContent = title;
      } else if (header.parentElement) {
        header.parentElement.style.display = "none";
      }
    }

    if (body) {
      const padding = this.getAttribute("padding") || "medium";
      body.className = `card-body card-padding-${padding}`;
    }
  },
});

// User profile component
const UserProfile = liftHtml("user-profile", {
  observedAttributes: ["user"],
  init() {
    const userData = this.getAttribute("user");
    if (!userData) return;

    try {
      const user = JSON.parse(userData);

      // Update user info
      const nameEl = this.querySelector("h4");
      const emailEl = this.querySelector("p");

      if (nameEl) nameEl.textContent = user.name;
      if (emailEl) emailEl.textContent = user.email;

      // Set up action buttons
      const editBtn = this.querySelector('my-button[variant="primary"] button');
      const deleteBtn = this.querySelector(
        'my-button[variant="danger"] button',
      );

      if (editBtn) {
        editBtn.onclick = () => {
          this.dispatchEvent(
            new CustomEvent("edit", {
              detail: { user },
              bubbles: true,
            }),
          );
        };
      }

      if (deleteBtn) {
        deleteBtn.onclick = () => {
          this.dispatchEvent(
            new CustomEvent("delete", {
              detail: { user },
              bubbles: true,
            }),
          );
        };
      }
    } catch (error) {
      console.error("Invalid user data:", error);
    }
  },
});
```

## Working with Existing HTML

Lift HTML components enhance existing HTML rather than rendering it. This means
you work with the DOM structure that's already present.

### Finding and Enhancing Elements

```javascript
const SearchBox = liftHtml("search-box", {
  observedAttributes: ["placeholder", "debounce"],
  init() {
    const input = this.querySelector("input");
    const results = this.querySelector(".results");
    const clearBtn = this.querySelector(".clear-btn");
    
    if (!input) {
      console.warn("<search-box> must contain an <input> element");
      return;
    }
    
    // Set up search functionality
    let searchTimeout;
    const debounceMs = parseInt(this.getAttribute("debounce") || "300");
    
    const performSearch = async (query) => {
      if (query.length < 2) {
        if (results) results.innerHTML = "";
        return;
      }
      
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const searchResults = await response.json();
        
        if (results) {
          results.innerHTML = ""; // Clear previous results
          searchResults.forEach(item => {
            const resultEl = document.createElement("div");
            resultEl.className = "result";
            resultEl.dataset.id = item.id;

            const titleEl = document.createElement("h4");
            titleEl.textContent = item.title;

            const descEl = document.createElement("p");
            descEl.textContent = item.description;

            resultEl.appendChild(titleEl);
            resultEl.appendChild(descEl);
            results.appendChild(resultEl);
          });
        }
      } catch (error) {
        console.error("Search failed:", error);
        if (results) results.innerHTML = '<div class="error">Search failed</div>';
      }
    };
    
    // Set up event listeners
    input.oninput = () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        performSearch(input.value);
      }, debounceMs);
    };
    
    if (clearBtn) {
      clearBtn.onclick = () => {
        input.value = "";
        if (results) results.innerHTML = "";
        input.focus();
      };
    }
    
    // Set placeholder from attribute
    const placeholder = this.getAttribute("placeholder");
    if (placeholder) input.placeholder = placeholder;
  },
});
```

### Conditional Rendering

Since you're working with existing HTML, conditional rendering is handled
through CSS or DOM manipulation:

```javascript
const TabPanel = liftHtml("tab-panel", {
  observedAttributes: ["active-tab"],
  init() {
    const tabs = this.querySelectorAll("[role='tab']");
    const panels = this.querySelectorAll("[role='tabpanel']");

    const showTab = (tabId) => {
      // Hide all panels
      panels.forEach((panel) => {
        panel.style.display = "none";
        panel.setAttribute("aria-hidden", "true");
      });

      // Deactivate all tabs
      tabs.forEach((tab) => {
        tab.setAttribute("aria-selected", "false");
        tab.classList.remove("active");
      });

      // Show selected panel
      const activePanel = this.querySelector(
        `[role='tabpanel'][id='${tabId}']`,
      );
      if (activePanel) {
        activePanel.style.display = "block";
        activePanel.setAttribute("aria-hidden", "false");
      }

      // Activate selected tab
      const activeTab = this.querySelector(
        `[role='tab'][aria-controls='${tabId}']`,
      );
      if (activeTab) {
        activeTab.setAttribute("aria-selected", "true");
        activeTab.classList.add("active");
      }
    };

    // Set up tab click handlers
    tabs.forEach((tab) => {
      tab.onclick = (e) => {
        e.preventDefault();
        const targetId = tab.getAttribute("aria-controls");
        if (targetId) {
          showTab(targetId);
          this.setAttribute("active-tab", targetId);
        }
      };
    });

    // Show initial tab
    const initialTab = this.getAttribute("active-tab");
    if (initialTab) {
      showTab(initialTab);
    } else if (tabs.length > 0) {
      const firstTab = tabs[0];
      const firstTabId = firstTab.getAttribute("aria-controls");
      if (firstTabId) showTab(firstTabId);
    }
  },
});
```

## Events and Communication

Components communicate through standard DOM events. Here's how to emit and
handle events.

### Emitting Events

```javascript
const FormInput = liftHtml("form-input", {
  observedAttributes: ["value", "type", "required"],
  init() {
    const input = this.querySelector("input");
    if (!input) return;

    // Set up input attributes
    const type = this.getAttribute("type") || "text";
    const required = this.hasAttribute("required");

    input.type = type;
    input.required = required;

    // Handle value changes
    input.oninput = (e) => {
      this.setAttribute("value", e.target.value);
      this.dispatchEvent(
        new CustomEvent("input", {
          detail: { value: e.target.value },
          bubbles: true,
        }),
      );
    };

    input.onchange = (e) => {
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: { value: e.target.value },
          bubbles: true,
        }),
      );
    };

    // Set initial value
    const initialValue = this.getAttribute("value");
    if (initialValue) input.value = initialValue;
  },
});
```

### Handling Events

```javascript
const Form = liftHtml("my-form", {
  init() {
    const form = this.querySelector("form");
    if (!form) return;

    // Handle form submission
    form.onsubmit = (e) => {
      e.preventDefault();

      // Collect form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      // Emit submit event
      this.dispatchEvent(
        new CustomEvent("submit", {
          detail: { data },
          bubbles: true,
        }),
      );
    };

    // Listen for input changes
    this.addEventListener("input", (e) => {
      console.log("Input changed:", e.detail.value);
    });

    // Listen for validation errors
    this.addEventListener("validation-error", (e) => {
      console.log("Validation error:", e.detail.message);
    });
  },
});
```

## Advanced Patterns

### Component Registry

Create a registry to manage component dependencies:

```javascript
// component-registry.js
class ComponentRegistry {
  constructor() {
    this.components = new Map();
    this.dependencies = new Map();
  }

  register(name, component, deps = []) {
    this.components.set(name, component);
    this.dependencies.set(name, deps);
  }

  get(name) {
    return this.components.get(name);
  }

  getDependencies(name) {
    return this.dependencies.get(name) || [];
  }
}

const registry = new ComponentRegistry();

// Register components
registry.register("my-button", Button);
registry.register("my-card", Card);
registry.register("user-profile", UserProfile, ["my-button", "my-card"]);

export default registry;
```

### Reactive Components with Solid

For more complex state management, use the solid package:

```javascript
import { liftSolid, useAttributes } from "@lift-html/solid";
import { createEffect, createMemo, createSignal } from "solid-js";

const DataTable = liftSolid("data-table", {
  observedAttributes: ["data", "sort-by", "filter"],
  init() {
    const table = this.querySelector("table");
    const tbody = table?.querySelector("tbody");
    if (!table || !tbody) return;

    const props = useAttributes(this);

    // Reactive data processing
    const processedData = createMemo(() => {
      const dataStr = props.data;
      if (!dataStr) return [];

      try {
        let data = JSON.parse(dataStr);

        // Apply filter
        const filter = props.filter;
        if (filter) {
          data = data.filter((item) =>
            Object.values(item).some((val) =>
              String(val).toLowerCase().includes(filter.toLowerCase())
            )
          );
        }

        // Apply sorting
        const sortBy = props["sort-by"];
        if (sortBy) {
          data.sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];
            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          });
        }

        return data;
      } catch (error) {
        console.error("Invalid data:", error);
        return [];
      }
    });

    // Reactive rendering
    createEffect(() => {
      const data = processedData();
      tbody.innerHTML = ""; // Clear previous data
      data.forEach(item => {
        const row = tbody.insertRow();
        row.insertCell().textContent = item.name;
        row.insertCell().textContent = item.email;
        row.insertCell().textContent = item.role;
      });
    });
  },
});
```

### Form Association

Create form-associated custom elements:

```javascript
const CustomSelect = liftHtml("custom-select", {
  formAssociated: true,
  observedAttributes: ["value", "options"],
  init() {
    const select = this.querySelector("select");
    if (!select) return;

    // Form association
    this.internals = this.attachInternals();

    // Parse options from attribute
    const optionsStr = this.getAttribute("options");
    if (optionsStr) {
      try {
        const options = JSON.parse(optionsStr);
        select.innerHTML = options.map((opt) =>
          `<option value="${opt.value}">${opt.label}</option>`
        ).join("");
      } catch (error) {
        console.error("Invalid options:", error);
      }
    }

    // Handle value changes
    select.onchange = (e) => {
      const value = e.target.value;
      this.setAttribute("value", value);
      this.internals.setFormValue(value);

      this.dispatchEvent(
        new CustomEvent("change", {
          detail: { value },
          bubbles: true,
        }),
      );
    };

    // Set initial value
    const initialValue = this.getAttribute("value");
    if (initialValue) {
      select.value = initialValue;
      this.internals.setFormValue(initialValue);
    }
  },
});
```

## Best Practices

### 1. Error Handling

Always check for required elements and handle missing HTML gracefully:

```javascript
const MyComponent = liftHtml("my-component", {
  init() {
    const requiredElement = this.querySelector(".required");
    if (!requiredElement) {
      console.warn("<my-component> must contain a .required element");
      return;
    }

    // Component logic here
  },
});
```

### 2. Cleanup

Use the `deInit` callback to clean up resources:

```javascript
const MyComponent = liftHtml("my-component", {
  init(deInit) {
    const button = this.querySelector("button");
    const handler = () => console.log("clicked");

    button.addEventListener("click", handler);

    deInit(() => {
      button.removeEventListener("click", handler);
    });
  },
});
```

### 3. TypeScript Declarations

Add TypeScript declarations for better IDE support:

```typescript
declare module "@lift-html/core" {
  interface KnownElements {
    "my-button": typeof Button;
    "my-card": typeof Card;
    "user-profile": typeof UserProfile;
  }
}
```

## Next Steps

- [Interoperability](/guides/interoperability/) - Use Lift HTML with other
  frameworks
- [Examples](/guides/example/) - See more examples
- [Advanced Patterns](/guides/advanced/) - Learn advanced component patterns
