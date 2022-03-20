/*!
 * Adapted directly util.ts at https://github.com/oakserver/oak
 * which is licensed as follows:

    MIT License

    Copyright (c) 2018-2022 the oak authors

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.

*/

const ENCODE_CHARS_REGEXP =
  /(?:[^\x21\x25\x26-\x3B\x3D\x3F-\x5B\x5D\x5F\x61-\x7A\x7E]|%(?:[^0-9A-Fa-f]|[0-9A-Fa-f][^0-9A-Fa-f]|$))+/g;
const HTAB = "\t".charCodeAt(0);
const SPACE = " ".charCodeAt(0);
const CR = "\r".charCodeAt(0);
const LF = "\n".charCodeAt(0);
export async function getRandomFilename(
  prefix = "",
  extension = ""
): Promise<string> {
  const buffer = await crypto.subtle.digest(
    "SHA-1",
    crypto.getRandomValues(new Uint8Array(256))
  );
  return `${prefix}${bufferToHex(buffer)}${extension ? `.${extension}` : ""}`;
}

export function assert(cond: unknown, msg = "Assertion failed"): asserts cond {
  if (!cond) {
    throw new Error(msg);
  }
}

function bufferToHex(buffer: ArrayBuffer): string {
  const arr = Array.from(new Uint8Array(buffer));
  return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Returns `u8` with leading white space removed. */
export function skipLWSPChar(u8: Uint8Array): Uint8Array {
  const result = new Uint8Array(u8.length);
  let j = 0;
  for (let i = 0; i < u8.length; i++) {
    if (u8[i] === SPACE || u8[i] === HTAB) continue;
    result[j++] = u8[i];
  }
  return result.slice(0, j);
}

export function stripEol(value: Uint8Array): Uint8Array {
  if (value[value.byteLength - 1] == LF) {
    let drop = 1;
    if (value.byteLength > 1 && value[value.byteLength - 2] === CR) {
      drop = 2;
    }
    return value.subarray(0, value.byteLength - drop);
  }
  return value;
}
