# lift-html

| package                                                | bundle size (plain -> gzip)                                                                                                                                          |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| @lift-html/tiny                                        | <img src="https://deno.bundlejs.com/?q=@lift-html/tiny&badge=detailed&badge-style=for-the-badge&treeshake=[{tinyLift}]" height="28" valign="middle">                 |
| @lift-html/core                                        | <img src="https://deno.bundlejs.com/?q=@lift-html/core&badge=detailed&badge-style=for-the-badge&treeshake=[{liftHtml}]" height="28" valign="middle">                 |
| @lift-html/solid (includes solid-js)                   | <img src="https://deno.bundlejs.com/?q=@lift-html/solid&badge=detailed&badge-style=for-the-badge&treeshake=[{liftSolid}]" height="28" valign="middle">               |
| @lift-html/solid (includes solid-js and useAttributes) | <img src="https://deno.bundlejs.com/?q=@lift-html/solid&badge=detailed&badge-style=for-the-badge&treeshake=[{liftSolid,useAttributes}]" height="28" valign="middle"> |

## What is lift-html

lift-html is a tiny library for building HTML Web Components, components that
are meant to enhance existing HTML on the page instead of rendering it on the
client or hydrating it. You can use SolidJS to make attributes reactive.

Code for `liftHtml` is public domain see more in the Vendoring section.

## Show me the code

```html
<!-- @lift-html/solid -->
<my-button>
  <button disabled>
    Loading...
  </button>
</my-button>
<script type="module">
  import { liftSolid } from "https://esm.sh/@lift-html/solid";
  import { createEffect, createSignal } from "https://esm.sh/solid-js";
  // define a custom element
  export const MyButton = liftSolid("my-button", {
    init() {
      const button = this.querySelector("button");
      if (!button) throw new Error("<my-button> must contain a <button>");
      button.disabled = false;
      const [count, setCount] = createSignal(0);
      button.onclick = () => setCount(count() + 1);
      createEffect(() => {
        button.textContent = `Clicks: ${count()}`;
      });
    },
  });
</script>
```

via [codepen](https://codepen.io/jlarky/pen/vYoPzNE?editors=1000), total code size
[3.41kb gzip](https://bundlejs.com/?q=https%3A%2F%2Fesm.sh%2F%40lift-html%2Fsolid%2Chttps%3A%2F%2Fesm.sh%2Fsolid-js&treeshake=%5B%7BliftSolid%7D%5D%2C%5B%7BcreateSignal%2CcreateEffect%7D%5D&share=PTAEBMFMDMEsDtKgIagMYFcDOAXA9gLaiQA2kBk8OAUKMQB4AOeATjunvLqALICeAIQw588UAF5QJWNBwBlPNPAAKAEQE%2BAWgBGw0aoA0oAN606oBLBzKAlCbPmOXdrpGcJoHAAtYWAHQAjhiQLHxypJBo%2BCxqrvo2ANwO5jKgygCEcZx23ix4AO6giIUAoix5MaoAPBo6epwAfKAE2OxonDjICCigVVnwDaqJyXT9fuC%2ByNpk4B7QyCRYkEmOdO3OoADa7RhURks4AMJ4uzgAuh5oLJDIOJBysADm8AvKAAzDq6BjnGjSaABrDy2CRNA7HU7KHZUEEAalAAEZPqsrjc7iVoNBItYQeImqYvqN6vA-Hd6EcOpR2JIAAaHf4ArAALlAABJjNDrDYAL40larbnIujcgxmQUJIA)
and with no-build
[8.94kb](https://bundlejs.com/?q=https%3A%2F%2Fesm.sh%2F%40lift-html%2Fsolid%2Chttps%3A%2F%2Fesm.sh%2Fsolid-js&treeshake=%5B*%5D%2C%5B*%5D&share=PTAEBMFMDMEsDtKgIagMYFcDOAXA9gLaiQA2kBk8OAUKMQB4AOeATjunvLqALICeAIQw588UAF5QJWNBwBlPNPAAKAEQE%2BAWgBGw0aoA0oAN606oBLBzKAlCbPmOXdrpGcJoHAAtYWAHQAjhiQLHxypJBo%2BCxqrvo2ANwO5jKgygCEcZx23ix4AO6giIUAoix5MaoAPBo6epwAfKAE2OxonDjICCigVVnwDaqJyXT9fuC%2ByNpk4B7QyCRYkEmOdO3OoADa7RhURks4AMJ4uzgAuh5oLJDIOJBysADm8AvKAAzDq6BjnGjSaABrDy2CRNA7HU7KHZUEEAalAAEZPqsrjc7iVoNBItYQeImqYvqN6vA-Hd6EcOpR2JIAAaHf4ArAALlAABJjNDrDYAL40larbnIujcgxmQUJIA)

```html
<!-- @lift-html/core -->
<my-button>
  <button disabled>
    Loading...
  </button>
</my-button>
<script type="module">
  import { liftHtml } from "https://esm.sh/@lift-html/core";
  // define a custom element
  export const MyButton = liftHtml("my-button", {
    init() {
      const button = this.querySelector("button");
      if (!button) throw new Error("<my-button> must contain a <button>");
      button.disabled = false;
      let count = 0;
      render();
      button.onclick = () => {
        count++;
        render();
      };

      function render() {
        button.textContent = `Clicks: ${count}`;
      }
    },
  });
</script>
```

via [codepen](https://codepen.io/jlarky/pen/ogvZMLR?editors=1000), total code size
[493 bytes gzip](https://bundlejs.com/?q=https%3A%2F%2Fesm.sh%2F%40lift-html%2Fcore&treeshake=%5B{liftHtml}%5D&share=PTAEBMFMDMEsDtKgIagMYFcDOAXA9gLaiQA2kBk8OAUJAB4AOeATjunvLqALICeAQhhz54oALygSsaDgASOAiQAUAIgK8AtACMhIlQBpQAb2qhQCWDiUBKY6bPtObHcI7jQOABawsAOgCOGJDMvADKpJBo%2BMyqLnrWANz2ZtKgSgCEcRy2Xsx4AO6giIUAosx5MSoAPOrauhwAfKAE2GxoHDjICCigVVnwDSqJyaD9vuA%2ByFpk4O7QyCRYkEkOkpBteBhU7gAMKw7MlFAxw6tjHGhSaADW7jbiTSarZu1bOADU7-urh-DHNt9QABfJIjaBbKKwNy-f62J7PMY4eg4ADCHUobAkAAMUVdrlgAFygAAkRleVCBWMBQPsQP01CBiSAA)
and with no-build
[505 bytes gzip](https://bundlejs.com/?q=https%3A%2F%2Fesm.sh%2F%40lift-html%2Fcore&treeshake=%5B*%5D&share=PTAEBMFMDMEsDtKgIagMYFcDOAXA9gLaiQA2kBk8OAUJAB4AOeATjunvLqALICeAQhhz54oALygSsaDgASOAiQAUAIgK8AtACMhIlQBpQAb2qhQCWDiUBKY6bPtObHcI7jQOABawsAOgCOGJDMvADKpJBo%2BMyqLnrWANz2ZtKgSgCEcRy2Xsx4AO6giIUAosx5MSoAPOrauhwAfKAE2GxoHDjICCigVVnwDSqJyaD9vuA%2ByFpk4O7QyCRYkEkOkpBteBhU7gAMKw7MlFAxw6tjHGhSaADW7jbiTSarZu1bOADU7-urh-DHNt9QABfJIjaBbKKwNy-f62J7PMY4eg4ADCHUobAkAAMUVdrlgAFygAAkRleVCBWMBQPsQP01CBiSAA)

## Why you need web components framework

Web Components are a browser primitive, kind of like `document.createElement`.
You are not expected to use them directly because of the amount of boilerplate
and DX issues. But similarly to `document.createElement`, there are plently of
usecases that require you to get your hands dirty with the native API.

`lift-html` is an attempt to create tiny wrapper around web components that
solves enough of DX issues without introducing a completely new paradigm. If I
would put it in a single sentence, it would be: "When using lift-html I don't
want to feel like I'm writing a component (web or otherwise), I just want to
write HTML, CSS and JS/TS".

To achieve that we had to depart a bit from the web components vibe. Namely:

<ul><li>
<details>
<summary>we don't use class syntax</summary>
Classes make your code overly concerned with lifecycles, so lift-html does a
similar to jump to one from class components in React to functional components.
Imagine a scenario of adding some sort of computed property, now with classes you start
by adding a property on the class to store a value, adding a getter on the class
to access it, adding a callback method to react and update that value and a call
in constructor to hook that callback to the lifecycle. All of those are going to
be spread over your whole class, mixing together in buckets (class properties,
class methods, getters, setters, public APIs, callbacks, constructor initializers,
connectedCallback initializers, destructors) and your only option to share the
logic is to use Mixins, which have their issues with performance and type safety.
With function syntax I can have `const thing = myThing(this)` and for the most
part not worry about how `myThing` is implemented. This does come with a bit of
theoretically loss of performance and flexibility compared to writing everything
by hand, but that option is always there if you need it. On a side node, if you
like classes and typescript be sure to check out
[this approach](https://github.com/trusktr/lowclass/blob/c182595253ee79f45e4770c97d1c55702e351866/src/Constructor.ts)
from Joe Pea (author of @lume/element)
</details>
</li>
<li><details>
<summary>we allow you to re-define component implementation at runtime</summary>
One thing that we are changing around web components is that we allow you to
register your components multiple times. The main use case for that is HMR, since
it will allow you to re-run your `init` function for a component that is already
on the page. One obvious limitation that still stands is that you can't change
observed attributes or formAssociated values. The details will depend on what sort
of dev server you are using, for more information read HMR section of the docs.
</details>
</li>
</ul>

But otherwise if you are looking at vanilla HTML Web Component and lift-html one
you might notice that they are 100% the same.

<details>
<summary>ThemeToggle Example: vanilla vs lift-html (click to expand)</summary>

Here's vanilla HTML Web Component from
[Astro source code](https://github.com/withastro/astro/blob/45c3f333872a236d7c6a70ac805356737cdc68ec/examples/portfolio/src/components/ThemeToggle.astro):

```html
<script>
  class ThemeToggle extends HTMLElement {
    constructor() {
      super();
      const button = this.querySelector('button')!;
      /** Set the theme to dark/light mode. */
      const setTheme = (dark: boolean) => {
        document.documentElement.classList[dark ? 'add' : 'remove']('theme-dark');
        button.setAttribute('aria-pressed', String(dark));
      };
      // Toggle the theme when a user clicks the button.
      button.addEventListener('click', () => setTheme(!this.isDark()));
      // Initialize button state to reflect current theme.
      setTheme(this.isDark());
    }
    isDark() {
      return document.documentElement.classList.contains('theme-dark');
    }
  }
  customElements.define('theme-toggle', ThemeToggle);
</script>
```

Now compare that to one using lift-html:

```html
<script>
  import { liftHtml } from "@lift-html/core";

  liftHtml("theme-toggle", {
    init() {
      const button = this.querySelector('button')!;
      /** Set the theme to dark/light mode. */
      const setTheme = (dark: boolean) => {
        document.documentElement.classList[dark ? 'add' : 'remove']('theme-dark');
        button.setAttribute('aria-pressed', String(dark));
      };
      // Toggle the theme when a user clicks the button.
      button.addEventListener('click', () => setTheme(!isDark()));
      // Initialize button state to reflect current theme.
      setTheme(isDark());
      function isDark() {
        return document.documentElement.classList.contains('theme-dark');
      }
    }
  });
</script>
```

If you can hardly notice the difference, that's the point. Apart from a couple
`super` and `this` missing, the code is the same. The biggest difference is that
we are using `init` instead of `constructor` because it's actually considered
[wrong](https://x.com/JLarky/status/1856139102241890740) to access DOM from the
constructor. And if you are a pedant you also noticed that `isDark` is now just
a function instead of a method.

Another note on implementation, this code is technically safe to run on the
server because it doesn't reference global `HTMLElement` class and
`customElements.define` method. It's also safe to run `liftHtml` multiple times,
the last implementation will win.

</details>

But the same can't be said about components using traditional web components
frameworks. Your `lift-html` will likely look differently compared to web
component authored in another web component framework. This is intentional, if
you want to use framework components, just use framework components. For example
a lot of code in other web components frameworks will have parts that look like
this:

- `class X extends MyFramework {}` and `@element` or `define()` - all that is
  done inside `liftHtml`
- `@attribute` - you can pass `observedAttributes` to `liftHtml` and use helpers
  like `useAttributes` with your favorite flavor of reactivity
- `shadow: true` - you can just directly call
  `this.attachShadow({mode: 'open'})` in `init` if you need it
- `@state` - that part is outside of the scope of `@lift-html/core`, you are
  free to build something of your own or use `@lift-html/solid` or
  `@lift-html/signal` for that
- `static styles = ...` just use `<style>` tag
- `render() { ... }` render where? in HTML Web Components you get your markup
  generated on the server, so it's already rendered and you can just work with
  it with `this.querySelector`

So as you can see we are not taking over any of the concerns of frameworks like
asset management, templating or state management. The assumption here is that
you are already using some sort of backend service that generated your markup
and `lift-html` is your solution to add interactivity to it, and you are free to
choose what flavor of reactivity (if any) you need for that. This does mean that
if the types of interactivity you are building requires a framework you are
probably going to use `lift-html` just as a loader for those framework
components, see more in Interoperability section.

### Interoperability

TODO

You can render `lift-html` components using your favorite framework with
type-safety. We recommend creating framework specific wrapper for your
components to generate light dom markup.

Packages to better integrate with other frameworks are planned, goal here is for
you to be able to make `lift-html` component wrappers out of existing React and
Solid components. The use cases:

- lazy load React component once some condition is met (like user scrolls to it)
- render Solid component (with SSR) as `lift-html` component so that you can
  share it on npm and are able to render it from any (js based) server like
  Astro or React.

### HMR

TODO

HMR in lift-html is very simple. Every time you register a component with
`liftHtml` it will overwrite the previous implementation. So use whatever live
reloading tool you like, copy component into the dev tools, whatever it should
all work. In the example repo see Vite and Astro examples using
`import.meta.hot?.accept();`.

### Vendoring

TODO

We are planning to have a command like `npx @lift-html/cli` that will save
`lift-html` code as a single file in your project, which is perfect for a
zero-dependency or no-build projects. Code for `liftHtml` is public domain, so
once you have it in your project you can do whatever you want with it. Which
could give you an opportunity to remove features you don't use or add something
that is missing.
