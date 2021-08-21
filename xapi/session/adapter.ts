export interface SessionAdapterInterface {
  load(key: string): string | null;
  store(key: string, value: string): void;
  loadMany(key: string[]): Map<string, string>;
  storeMany(values: Map<string, string>): void;
}

export class FileSessionAdapter implements SessionAdapterInterface {
  loadMany(key: string[]): Map<string, string> {
    throw new Error("Method not implemented.");
  }
  storeMany(values: Map<string, string>): void {
    throw new Error("Method not implemented.");
  }
  load(key: string): string {
    throw new Error("Method not implemented.");
  }
  store(key: string, value: string): void {
    throw new Error("Method not implemented.");
  }
}

export class InMemorySessionAdapter implements SessionAdapterInterface {
  private sessionData: Map<string, string> = new Map();
  load(key: string): string | null {
    let data = this.sessionData.get(key);
    if (data == undefined) {
      return null;
    }
    return data;
  }
  store(key: string, value: string): void {
    this.sessionData.set(key, value);
  }
  loadMany(key: string[]): Map<string, string> {
    throw new Error("Method not implemented.");
  }
  storeMany(values: Map<string, string>): void {
    throw new Error("Method not implemented.");
  }
}
