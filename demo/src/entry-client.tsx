// @refresh reload
/* @jsxImportSource solid-js */
import { mount, StartClient } from "@solidjs/start/client";
import type { Solidify, KnownElements } from "@lift-html/lift-html";
import "./components/Counter.WC.tsx";

mount(() => <StartClient />, document.getElementById("app")!);

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements
      extends Solidify<JSX.HTMLAttributes<HTMLDivElement>, KnownElements> {}
  }
}
