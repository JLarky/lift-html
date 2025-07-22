---
title: liFt-html vs lit-html
description: A guide to the differences between Lift HTML and Lit HTML.
---

## liFt-html vs lit-html

I get a lot of people confused when I talk about liFt-html because they think
it's the same thing as lit-html. Lit stands for string template **lit**eral
**\`html\`**. And Lift stands for **lift**ing your existing **HTML** to become
an app. One describes templating strategy, the other describes the approach of
progressive enhancment. BTW, in the recent years `lit-html` was mostly consumed
into the Lit framework and barely gets [mentioned](https://lit.dev/docs/libraries/standalone-templates/) in the docs anymore.

### Core Philosophies

**Lit** is designed to compete with frameworks like React. And over the years
a lot of features of Lit got built-in into the browsers which allows Lit to have
pretty small bundle size (although not the smallest by any means).

**Lit HTML** is a templating engine, so it could compete with things like [EJS](https://ejs.co/), [Eta](https://eta.js.org/), Pug, Jade, Handlebars. But it has some runtime performance characteristics that allow it to be [more efficient](https://github.com/lit/lit/blob/main/dev-docs/design/how-lit-html-works.md#summary-of-lit-html-rendering-phases) for the use-case of rendering component templates, thus its use in Lit.

**Lift HTML** is a collection of opt-in modules that allows you to build applications in web-native manner with minimal overhead, philosophically it's closer in use-case to something like Hotwire, but less opinionated. A toolkit for you to build html-first applications, adding splrinkles of JS when needed, adding signals or other reactive primitives when needed, adding server-driven interactivity when needed. 
