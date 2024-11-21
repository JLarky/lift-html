// @refresh reload
"use client";
import { liftHtml } from "@lift-html/lift-html";
import { Signal } from "signal-polyfill";
import { effect } from "./effect.ts";

// define a custom element
const MyButton = liftHtml("my-button", {
  init(onCleanup) {
    const button = this.querySelector("button");
    if (!button) throw new Error("<my-button> must contain a <button>");
    button.disabled = false;
    const count = new Signal.State(0);
    button.onclick = () => count.set(count.get() + 1);
    const cleanup = effect(
      () => (button.textContent = `Clicks: ${count.get()}`)
    );
    onCleanup(cleanup);
  },
});

// define types for the custom element
declare module "@lift-html/lift-html" {
  interface KnownElements {
    "my-button": typeof MyButton;
  }
}
