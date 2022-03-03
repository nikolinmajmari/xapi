import singlePathAndMethodTest from "./layer_handeler_tests/single_path.ts";

Deno.test({
  name: "testing single level path match and method match ",
  fn: singlePathAndMethodTest,
});
