import { SessionContextInterface } from "../../session/session.ts";
import { AuthContextInterface } from "../core/context/auth_context_interface.ts";
import TokenInterface from "../core/credentials/token_interface.ts";
import { UserToken } from "../core/credentials/user_token.ts";
import { StateFullStrategy } from "../core/strategy/statefull_strategy.ts";

export class SessionStrategy extends StateFullStrategy {
  constructor(
    private key: string,
  ) {
    super();
  }
  load(ctx: SessionContextInterface): TokenInterface | undefined {
    const token = ctx.session?.get(this.key);
    if (token != null || token != undefined) {
      return UserToken.fromJson(JSON.parse(token));
    }
    return undefined;
  }
  store(ctx: SessionContextInterface, token: TokenInterface): void {
    ctx.session?.set(this.key, token.toString());
  }
  entry(auth: AuthContextInterface): void {
    throw new Error("Method not implemented.");
  }
}
