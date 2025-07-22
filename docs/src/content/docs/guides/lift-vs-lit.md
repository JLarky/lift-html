---
title: Lift HTML vs Lit HTML
description: A guide to the differences between Lift HTML and Lit HTML.
---

## Lift HTML vs Lit HTML

This guide will walk you through the key differences between Lift HTML and its
inspiration, Lit HTML. While both libraries share the goal of making it easier
to build dynamic web UIs with web components, they have some fundamental
distinctions in their approach and features.

### Core Philosophies

**Lit HTML** is a lightweight and efficient templating library that focuses on
providing a simple and declarative way to create and update DOM. It's designed
to be a minimal layer on top of standard web platform APIs.

**Lift HTML**, on the other hand, is built on top of Lit HTML but aims to
provide a more "batteries-included" experience. It adds features that are
commonly needed in web applications, such as state management, component
lifecycle helpers, and more.

### Key Differences

| Feature                 | Lit HTML                          | Lift HTML                                              |
| :---------------------- | :-------------------------------- | :----------------------------------------------------- |
| **State Management**    | None built-in                     | `signal` and `computed` for reactive state             |
| **Component Lifecycle** | Standard custom element lifecycle | Enhanced lifecycle with `onConnect` and `onDisconnect` |
| **Reactivity**          | Manual re-rendering               | Automatic re-rendering with signals                    |
| **Directives**          | Core set of directives            | Extended directives for common use cases               |

### When to Choose Which

- **Choose Lit HTML if:**
  - You need a minimal, fast, and unopinionated templating library.
  - You are building a small component or a library where you want to minimize
    dependencies.
  - You prefer to build your own state management and component model.

- **Choose Lift HTML if:**
  - You are building a full-featured web application.
  - You want a more integrated development experience with built-in state
    management.
  - You appreciate the convenience of additional directives and lifecycle
    helpers.

By understanding these differences, you can make an informed decision about
which library is the best fit for your project.
