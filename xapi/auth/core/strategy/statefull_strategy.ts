import { HttpContextInterface } from "../../../http/http.lib.ts";
import { AuthContextInterface } from "../context/auth_context_interface.ts";
import TokenInterface from "../credentials/token_interface.ts";
import { StrategyInterface } from "./strategy_interface.ts";

interface StateFullStrategyInterface extends StrategyInterface {
  load(ctx: AuthContextInterface): TokenInterface | undefined;
  store(ctx: AuthContextInterface, token: TokenInterface): void;
}

export abstract class StateFullStrategy
  implements StateFullStrategyInterface, StrategyInterface {
  load(ctx: HttpContextInterface): TokenInterface | undefined {
    throw new Error("Method not implemented.");
  }
  store(ctx: HttpContextInterface, token: TokenInterface): void {
    throw new Error("Method not implemented.");
  }
  entry(auth: HttpContextInterface): void {
    throw new Error("Method not implemented.");
  }
}
