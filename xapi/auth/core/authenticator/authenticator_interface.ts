import { AuthContextInterface } from "../context/auth_context_interface.ts";
import { StrategyInterface } from "../strategy/strategy_interface.ts";

interface AuthenticatorInterface {
  strategy: StrategyInterface;
  authenticate(ctx: AuthContextInterface): void;
}
