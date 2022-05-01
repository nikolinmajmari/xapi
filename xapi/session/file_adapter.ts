import {SessionAdapterInterface} from "./adapter.ts";
import {base64Decode, base64Encode} from "./deps.ts";

export class FileAdapter implements SessionAdapterInterface {
  private sessionPath: string | undefined;

  configure(options: {sessionPath: string}) {
    this.sessionPath = options.sessionPath;
    return this;
  }

  async load(key: string): Promise<string> {
    const fp = await Deno.open(this.sessionPath + "/" + key, {
      create: true,
      read: true,
      write: true,
    });
    const text = new TextDecoder().decode(
      await (
        await fp.readable.getReader().read()
      ).value
    );
    return text;
  }
  async store(key: string, value: string): Promise<void> {
    await Deno.writeTextFile(this.sessionPath + "/" + key,value);
  }
}
