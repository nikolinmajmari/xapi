import UserInterface from "./user_interface.ts";

export default class BaseUser implements UserInterface {
  protected identifier?: string;
  protected password?: string;
  protected attributes?: [];

  getIdentifier(): string | undefined {
    return this.identifier;
  }

  getPassword(): string | undefined {
    return this.password;
  }
  getAttributes(): [] {
    return [];
  }
  setAttributes(attributes: []): void {
    this.attributes = attributes;
  }
}
