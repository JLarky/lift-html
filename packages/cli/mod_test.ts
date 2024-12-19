import { assertEquals } from "jsr:@std/assert";

Deno.test({
  name: "test",
  fn() {
    assertEquals("world", "world");
  },
});
