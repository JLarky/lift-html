/* @jsxImportSource solid-js */
import "./Counter.css";
import { CounterWC } from "./Counter.WC.tsx";

export default function Counter() {
  return (
    <>
      <my-button>
        <button class="increment" type="button" disabled>
          Clicks: 0
        </button>
      </my-button>
      <CounterWC />
    </>
  );
}
