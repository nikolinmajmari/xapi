import UserInterface from "./user_interface.ts";

export default interface TokenInterface {
  getKey(): string;
  hasExpired(): boolean;
  getUser(): UserInterface;
  getBadges(): [];
  toString(): string;
}
