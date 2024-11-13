/* @jsxImportSource solid-js */
import { Title } from "@solidjs/meta";

export default function Home() {
  return (
    <main>
      <Title>About</Title>
      <h1>About</h1>
      <div>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/xtKZqArvN6o?si=EdHsbeRjPVCx51Jf"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          style={{ border: 0 }}
          allowfullscreen
        ></iframe>
      </div>
      <p>
        Part of{" "}
        <a href="https://hack.solidjs.com/" style={{ margin: 0 }}>
          Solid Hack 2024
        </a>
        , repo{" "}
        <a href="https://github.com/JLarky/lift-html">
          github.com/JLarky/lift-html
        </a>
      </p>
    </main>
  );
}
