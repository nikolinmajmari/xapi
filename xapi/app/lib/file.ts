import {FormDataFile} from "../../http/lib/oak/multipart.ts";

export class XapiFormDataFiles {
  #files: FormDataFile[];
  constructor(files: FormDataFile[]) {
    this.#files = files;
  }

  get(key: string): XapiFormDataFile | null {
    const file = this.#files.findLast((e) => e.name == key);
    if (file != undefined) return new XapiFormDataFile(file!);
    return null;
  }
}

class XapiFormDataFile {
  #file: FormDataFile;
  constructor(file: FormDataFile) {
    this.#file = file;
  }

  get originalName(): string {
    return this.#file.originalName;
  }

  async save(path: string): Promise<void> {
    const fp = await Deno.open(path, {
      write: true,
      create: true,
    });
    if (this.#file.content != undefined) {
      await fp.writable.getWriter().write(this.#file.content);
    } else {
      const source = await Deno.open(this.#file.filename!, {read: true});
      await source.readable.pipeTo(fp.writable);
    }
  }
}
