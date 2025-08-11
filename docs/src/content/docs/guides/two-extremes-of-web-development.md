---
title: Two extremes of web development
description: Adding a simple feature like “copy to clipboard” across the spectrum - from JS-first SPA to jQuery - and how liFt-html gives you a pragmatic middle path
---

### The setup

Imagine someone asked you to add a “copy to clipboard” button. If you search for “how to add a copy to clipboard button,” you’ll likely find a React example. The component itself won’t look complicated, but soon you’re asking: how do I install React? How do I run TypeScript? How do I bundle? Where do assets live? It’s the joke: “You wanted a banana but what you got was a gorilla holding the banana and the entire jungle.”

On the opposite end, you could hard‑code a quick solution with jQuery via a CDN. That’s also easy to get started with: include one script, add an event listener, done. But you’ve pulled in a non‑trivial bundle, and the solution ends up tightly coupled to specific IDs or markup, making reuse and evolution harder.

And to bridge the gap between those extremes, you can use Lift HTML.

### Extreme 1: JS‑first SPA (React example)

```tsx
import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [label, setLabel] = useState("Copy");

  async function onClick() {
    try {
      await navigator.clipboard.writeText(text);
      setLabel("Copied!");
      setTimeout(() => setLabel("Copy"), 1500);
    } catch {
      setLabel("Failed");
    }
  }

  return <button onClick={onClick}>{label}</button>;
}

// Usage
// <CopyButton text="Hello, world!" />
```

- Pros: componentized, reusable, consistent with the rest of a SPA.
- Cons: requires SPA tooling (bundler, dev server, TS config, asset pipeline) even for a tiny feature.
- [StackBlitz example](https://stackblitz.com/edit/vitejs-vite-vm3vyb3l?file=src%2FCopyButton.tsx) 59kb gzipped (no server markup).

### Extreme 2: Hard‑coded jQuery via CDN

```html
<button id="copy-btn" data-text="Hello, world!">Copy</button>
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script>
  $("#copy-btn").on("click", async function () {
    try {
      await navigator.clipboard.writeText($(this).data("text"));
      $(this).text("Copied!");
      setTimeout(() => $(this).text("Copy"), 1500);
    } catch {
      $(this).text("Failed");
    }
  });
</script>
```

- Pros: trivial to drop in; no build or framework needed.
- Cons: extra KB for jQuery; solution is brittle and less reusable across pages.
- [CodePen example](https://codepen.io/jlarky/pen/ogjGLOL?editors=1000) 30kb gzipped.

### The middle path: lift-html component

Start with plain HTML that works without JS. Then “lift” just the interactive piece into a component. You can begin with a single CDN import and later adopt npm, TypeScript, and a build step - same API, no rewrite.

```html
<copy-button text="Hello, world!">
  <button>Copy</button>
</copy-button>
<script type="module">
  import { liftHtml } from "https://esm.sh/@lift-html/core";
  liftHtml("copy-button", {
    init() {
      const btn = this.querySelector("button");
      btn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(this.getAttribute("text"));
          btn.textContent = "Copied!";
          setTimeout(() => btn.textContent = "Copy", 1500);
        } catch {
          btn.textContent = "Failed";
        }
      };
    },
  });
</script>
```

- **Reusable like a framework component**: use `<copy-button>` across pages.
- **HTML‑first**: the markup is clear, and the page can render without JavaScript.
- **Pay as you go**: start with a CDN; later `npm install @lift-html/core` without any rewrites or migrations.
- **TypeScript**: you can easily add type information for this component if you need it.
- [CodePen example](https://codepen.io/jlarky/pen/OPyxXYz?editors=1000) less than 1kb gzipped.

### Conclusion

- Performance baseline. Keep most pages at near‑zero JS and add code only to interactive islands. Each lifted component brings just its own logic, so payload growth stays predictable and small.
- Component mental model. Think in components with clear boundaries, attributes as props, and events for communication, without adopting a SPA. You get reuse and maintainability while pages remain server‑driven and fast.
- If teams gets bigger, if you need to integrate with existing packages, or improve DX you know that you don't have to change the whole architecture. All existing components or exising pages can stay simple and fast while you add `<the-fattest-dashboard-ever>` component to your new page.
- On the opposite end, if you are struggling with performance of your SPA archtecture start rendering some HTML on the server and adding lift-html facade components that will lazy load your existing React components.
