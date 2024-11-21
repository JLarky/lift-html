/* @jsxImportSource solid-js */
import { Title } from "@solidjs/meta";
import Counter from "../components/Counter.tsx";
import CounterText from "../components/Counter.WC.tsx?raw";
import { ShowCode } from "../components/utils/ShowCode.tsx";

export default function Home() {
  return (
    <main>
      <Title>lift-html: lift counter example</Title>
      <h1>lift counter example</h1>
      <Counter />
      <ShowCode code={CounterText} />
    </main>
  );
}
