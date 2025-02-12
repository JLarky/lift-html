import { launch } from "jsr:@astral/astral";
import { assertEquals } from "jsr:@std/assert";
import $ from "jsr:@david/dax";
import Server from "lume/core/server.ts";

Deno.test({
  name: "Browser test",
  async fn(t) {
    const PORT = 3000 + Math.floor(Math.random() * 1000);
    const [server, browser] = await Promise.all([
      (async () => {
        await $`deno task build`.cwd(import.meta.dirname!).quiet();
        const root = import.meta.dirname + "/_site";
        const server = new Server({ root, port: PORT });
        server.start();
        return server;
      })(),
      (() => launch())(),
    ]);

    await t.step({
      name: "core: check reaction to attribute change",
      async fn() {
        const page = await browser.newPage(
          "http://localhost:" + PORT + "/core",
        );
        await page.waitForSelector(".loaded");
        const value = await page.evaluate(() => {
          return document.body.innerHTML.trim();
        });
        assertEquals(
          value,
          '<lift-counter count="1"><div class="loaded">1</div></lift-counter>',
        );
        const value2 = await page.evaluate(() => {
          document.querySelector("lift-counter")!.setAttribute("count", "2");
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
        const page = await browser.newPage(
          "http://localhost:" + PORT + "/solid",
        );
        await page.waitForSelector(".loaded");
        const value = await page.evaluate(() => {
          return document.body.innerHTML.trim();
        });
        assertEquals(
          value,
          '<lift-counter count="1"><div class="loaded">1</div></lift-counter>',
        );
        const value2 = await page.evaluate(() => {
          document.querySelector("lift-counter")!.setAttribute("count", "2");
          return document.body.innerHTML.trim();
        });
        assertEquals(
          value2,
          '<lift-counter count="2"><div class="loaded">2</div></lift-counter>',
        );
      },
    });

    await t.step({
      name: "svelte: check reaction to attribute change",
      async fn() {
        const page = await browser.newPage(
          "http://localhost:" + PORT + "/svelte",
        );
        await page.waitForSelector(".loaded");
        const value = await page.evaluate(() => {
          return document.body.innerHTML.trim();
        });
        assertEquals(
          value,
          '<lift-counter count="1"><div class="loaded">1</div></lift-counter>',
        );
        // svelte schedules its updates, so we expect that effect didn't run
        const value2 = await page.evaluate(() => {
          document.querySelector("lift-counter")!.setAttribute("count", "2");
          return document.body.innerHTML.trim();
        });
        assertEquals(
          value2,
          '<lift-counter count="2"><div class="loaded">1</div></lift-counter>',
        );
        // svelte schedules its updates, on the next tick we expect the new value
        const value3 = await page.evaluate(() => {
          document.querySelector("lift-counter")!.setAttribute("count", "2");
          return document.body.innerHTML.trim();
        });
        assertEquals(
          value3,
          '<lift-counter count="2"><div class="loaded">2</div></lift-counter>',
        );
      },
    });

    await t.step({
      name: "solid: works with HMR",
      async fn() {
        const page = await browser.newPage(
          "http://localhost:" + PORT + "/solid",
        );
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
          document.querySelector("lift-counter")!.setAttribute("count", "2");
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
        const page = await browser.newPage(
          "http://localhost:" + PORT + "/tiny",
        );
        await page.waitForSelector(".loaded");
        const value = await page.evaluate(() => {
          return document.body.innerHTML.trim();
        });
        assertEquals(
          value,
          '<lift-counter count="1"><div class="loaded">1</div></lift-counter>',
        );
        const value2 = await page.evaluate(() => {
          document.querySelector("lift-counter")!.setAttribute("count", "2");
          return document.body.innerHTML.trim();
        });
        // no reaction to attribute change
        assertEquals(
          value2,
          '<lift-counter count="2"><div class="loaded">1</div></lift-counter>',
        );
      },
    });

    server.stop();
    await browser.close();
  },
});
