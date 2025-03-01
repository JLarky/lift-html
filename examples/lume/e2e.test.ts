import { launch } from "jsr:@astral/astral";
import { assertEquals } from "jsr:@std/assert";
import $ from "jsr:@david/dax";
import Server from "lume/core/server.ts";

Deno.test({
  name: "Browser test",
  async fn(t) {
    const PORT = 3000 + Math.floor(Math.random() * 1000);
    const browserPromise = launch();
    const res = Promise.all([
      (async () => {
        const dirname = import.meta.dirname;
        if (!dirname) throw new Error("dirname not found");
        await $`deno task build`.cwd(dirname).quiet();
        const root = `${dirname}/_site`;
        return root;
      })(),
      browserPromise,
      browserPromise.then((browser) => browser.newPage()),
    ]);

    await t.step({
      name: `starting server http://localhost:${PORT}`,
      async fn() {
        await res;
      },
    });

    const [root, browser, page] = await res;

    const server = new Server({ root, port: PORT });
    server.start();

    await t.step({
      name: "core: check reaction to attribute change",
      async fn() {
        await page.goto(`http://localhost:${PORT}/core`, {
          waitUntil: "load",
        });
        await page.waitForSelector(".loaded");
        const value = await page.evaluate(() => {
          return document.body.innerHTML.trim();
        });
        assertEquals(
          value,
          '<lift-counter count="1"><div class="loaded">1</div></lift-counter>',
        );
        const value2 = await page.evaluate(() => {
          const counter = document.querySelector("lift-counter");
          if (!counter) throw new Error("Counter not found");
          counter.setAttribute("count", "2");
          return document.body.innerHTML.trim();
        });
        assertEquals(
          value2,
          '<lift-counter count="2"><div class="loaded">2</div></lift-counter>',
        );
      },
    });

    await t.step({
      name: "solid: check reaction to attribute change",
      async fn() {
        await page.goto(`http://localhost:${PORT}/solid`, {
          waitUntil: "load",
        });
        await page.waitForSelector(".loaded");
        const value = await page.evaluate(() => {
          return document.body.innerHTML.trim();
        });
        assertEquals(
          value,
          '<lift-counter count="1"><div class="loaded">1</div></lift-counter>',
        );
        const value2 = await page.evaluate(() => {
          const counter = document.querySelector("lift-counter");
          if (!counter) throw new Error("Counter not found");
          counter.setAttribute("count", "2");
          return document.body.innerHTML.trim();
        });
        assertEquals(
          value2,
          '<lift-counter count="2"><div class="loaded">2</div></lift-counter>',
        );
      },
    });

    await t.step({
      name: "solid: works with HMR",
      async fn() {
        await page.goto(`http://localhost:${PORT}/solid`, {
          waitUntil: "load",
        });
        await page.waitForSelector(".loaded");
        const value = await page.evaluate(() => {
          return document.body.innerHTML.trim();
        });
        assertEquals(
          value,
          '<lift-counter count="1"><div class="loaded">1</div></lift-counter>',
        );
        // load new implementation
        const value2 = await page.evaluate(async () => {
          await import("/solid-hmr.client.js");
          return document.body.innerHTML.trim();
        });
        assertEquals(
          value2,
          '<lift-counter count="1"><span class="loaded">1</span></lift-counter>',
        );
        // still reactive
        const value3 = await page.evaluate(() => {
          const counter = document.querySelector("lift-counter");
          if (!counter) throw new Error("Counter not found");
          counter.setAttribute("count", "2");
          return document.body.innerHTML.trim();
        });
        assertEquals(
          value3,
          '<lift-counter count="2"><span class="loaded">2</span></lift-counter>',
        );
      },
    });

    await t.step({
      name: "tiny: check reaction to attribute change",
      async fn() {
        await page.goto(`http://localhost:${PORT}/tiny`, {
          waitUntil: "load",
        });
        await page.waitForSelector(".loaded");
        const value = await page.evaluate(() => {
          return document.body.innerHTML.trim();
        });
        assertEquals(
          value,
          '<lift-counter count="1"><div class="loaded">1</div></lift-counter>',
        );
        const value2 = await page.evaluate(() => {
          const counter = document.querySelector("lift-counter");
          if (!counter) throw new Error("Counter not found");
          counter.setAttribute("count", "2");
          return document.body.innerHTML.trim();
        });
        // no reaction to attribute change
        assertEquals(
          value2,
          '<lift-counter count="2"><div class="loaded">1</div></lift-counter>',
        );
      },
    });

    await t.step({
      name: "tiny: check reconnection behavior",
      async fn() {
        await page.goto(`http://localhost:${PORT}/tiny`, {
          waitUntil: "load",
        });
        await page.waitForSelector(".loaded");

        // Initial state
        const value = await page.evaluate(() => {
          return document.body.innerHTML.trim();
        });
        assertEquals(
          value,
          '<lift-counter count="1"><div class="loaded">1</div></lift-counter>',
        );

        // Remove and reattach the element to trigger connectedCallback
        const value2 = await page.evaluate(() => {
          const counter = document.querySelector("lift-counter");
          if (!counter) throw new Error("Counter not found");
          const parent = counter.parentElement;
          if (!parent) throw new Error("Parent not found");

          // Remove and reattach to trigger connectedCallback
          parent.removeChild(counter);
          parent.appendChild(counter);
          return document.body.innerHTML.trim();
        });

        // Should show the same content after reconnection
        assertEquals(
          value2,
          '<lift-counter count="1"><div class="loaded">1</div></lift-counter>',
        );
      },
    });

    await t.step({
      name: "alien: check reaction to attribute change",
      async fn() {
        await page.goto(`http://localhost:${PORT}/alien`, {
          waitUntil: "load",
        });
        await page.waitForSelector(".loaded");
        const value = await page.evaluate(() => {
          return document.body.innerHTML.trim();
        });
        assertEquals(
          value,
          '<lift-counter count="1"><div class="loaded">1</div></lift-counter>',
        );
        const value2 = await page.evaluate(() => {
          const counter = document.querySelector("lift-counter");
          if (!counter) throw new Error("Counter not found");
          counter.setAttribute("count", "2");
          return document.body.innerHTML.trim();
        });
        assertEquals(
          value2,
          '<lift-counter count="2"><div class="loaded">2</div></lift-counter>',
        );
      },
    });

    server.stop();
    await browser.close();
  },
});
