export interface SessionAdapterInterface {
  load(key: string): string | Promise<string | null> | null;
  store(key: string, value: any): void;
}

export class InMemorySessionAdapter implements SessionAdapterInterface {
  loadMany(sessionid: string): Map<string, string> {
    throw new Error("Method not implemented.");
  }
  storeMany(sessionid: string, data: Map<string, string>): void {
    throw new Error("Method not implemented.");
  }
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
