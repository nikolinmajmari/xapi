import TokenInterface from "../credentials/token_interface.ts";

export default interface TokenStorageInterface {
  load(key: string): TokenInterface;
  store(key: string, token: TokenInterface): void;
}
