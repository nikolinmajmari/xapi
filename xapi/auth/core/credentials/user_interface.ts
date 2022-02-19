export default interface UserInterface {
  getIdentifier(): string | undefined;
  getPassword(): string | undefined;
  getAttributes(): [];
  setAttributes(attributes: []): void;
}
