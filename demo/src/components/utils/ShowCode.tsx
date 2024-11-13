/* @jsxImportSource solid-js */
export function ShowCode({ code }: { code: string }) {
  const text = code
    .replace("// @refresh reload\n", "")
    .replace('"use client";\n', "")
    .split("/**")[0];
  return (
    <section
      style={{ "text-align": "left", margin: "0 auto", "max-width": "50vw" }}
    >
      <h3>Code:</h3>
      <code>
        <pre>{text}</pre>
      </code>
    </section>
  );
}
