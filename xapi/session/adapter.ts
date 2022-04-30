export interface SessionAdapterInterface {
  load(key: string): string | Promise<string | null> | null;
  store(key: string, value: any): void;
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
}
