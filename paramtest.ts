import { ParamParser } from "./xapi/router/router.lib.ts";

const chunk = ":contact([6-9][0-9]{9})";
var parser = new ParamParser(chunk);
console.log("chunk: ", chunk);
console.log(parser.isParam());
console.log(parser.isRegex());
console.log(parser.getParam());
console.log(parser.getRegex());
