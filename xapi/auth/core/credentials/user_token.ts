import TokenInterface from "./token_interface.ts";
import UserInterface from "./user_interface.ts";

export class UserToken implements TokenInterface {
  constructor(
    private user: UserInterface,
    private providerKey: string,
    private nonce: number,
    private timestamp: number,
    private badges: [],
  ) {}
  getKey(): string {
    return this.providerKey;
  }
  hasExpired(): boolean {
    return false;
  }
  getUser(): UserInterface {
    return this.user;
  }
  getBadges(): [] {
    return this.badges;
  }

  toString() {
    return JSON.stringify({
      user: this.user,
      providerKey: this.providerKey,
      nonce: this.nonce,
      timestamp: this.timestamp,
      badges: this.badges,
    });
  }

  static fromJson(
    json: {
      user: {};
      providerKey: string;
      nonce: number;
      timestamp: number;
      badges: [];
    },
  ) {
    return new UserToken(
      json.user as UserInterface,
      json.providerKey,
      json.nonce,
      json.timestamp,
      json.badges,
    );
  }
}
