import {ContextHandlerInterface} from "../deps.ts";
import {FunctionHandler, Router} from "./router.ts";
import staticMiddleware from "./static.ts";

export interface IFileManagerConfig {
  path: string;
  middlewares: FunctionHandler[] | undefined;
  middlewarePath: string;
}

export class FileManager {
  #router: Router;
  #config: IFileManagerConfig;
  #servingMiddleware: ContextHandlerInterface | undefined;
  constructor(config: IFileManagerConfig) {
    this.#router = new Router();
    this.#config = config;
  }

  config(config: IFileManagerConfig): FileManager {
    this.#config = {...this.#config, ...config};
    return this;
  }

  addMiddleware(...middlewares: FunctionHandler[]): FileManager {
    this.#config.middlewares?.push(...middlewares);
    return this;
  }

  init(): ContextHandlerInterface {
    for (const middleware of this.#config.middlewares ?? []) {
      this.#router.use(middleware);
    }
    this.#servingMiddleware = staticMiddleware({
      path: this.#config.path,
      urlMapper: (str) => {
        return str.replace(this.#config.middlewarePath, "");
      },
    });
    this.#router.use(this.#servingMiddleware);
    return this.#router;
  }
}

const userScopingMiddleware: FunctionHandler = async (ctx, next) => {
  /// todo require user is authenticated here
  await next();
};

const defaultConfig = {
  path: "/private",
  middlewares: [userScopingMiddleware],
} as IFileManagerConfig;

const manager = new FileManager(defaultConfig);

export default manager;
