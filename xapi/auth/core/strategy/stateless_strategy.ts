import TokenInterface from "../credentials/token_interface.ts";
import UserInterface from "../credentials/user_interface.ts";
import { StrategyInterface } from "./strategy_interface.ts";

export interface StatelessStrategyInterface extends StrategyInterface {
  generateToken(user: UserInterface): string;
  validateToken(token: TokenInterface): string;
}
