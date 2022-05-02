import {HttpMethod} from "../context.ts";

/**
 * holds infor about route information , used for regex operations
 */
export class Route {
  // todo remove method
  #method: HttpMethod;
  /// string pattern reprezenting the route
  #pattern: string;
  /// strict reg exp reprezented by route
  #strictRegex?: RegExp;
  /// prefix reg exp reprezented by route
  #prefixRegex?: RegExp;
  #isRegex: boolean;
  constructor(method: HttpMethod, route: string) {
    this.#method = method;
    this.#pattern = route;
    this.#isRegex = false;
    this.#strictRegex = new RegExp(`^${this.pattern}$`);
    this.#prefixRegex = new RegExp(`^${this.pattern}`);
  }
  bindToParent(parent: Route) {
    this.connectWithParent(parent);
  }

  /// routes are connected to parents from up to bottom
  connectWithParent(parent: Route) {
    this.#pattern = `${parent.pattern ?? "/"}${this.#pattern ?? ""}`;
    this.#strictRegex = new RegExp(`^${this.pattern}$`);
    this.#prefixRegex = new RegExp(`^${this.pattern}`);
    this.#isRegex = this.#isRegex || parent.#isRegex;
  }

  setRegex(status: boolean) {
    this.#isRegex = status;
  }
  get isRegex(): boolean {
    return this.#isRegex;
  }
  get method(): HttpMethod {
    return this.#method;
  }
  get pattern(): string {
    return this.#pattern;
  }
  get strictRegex(): RegExp | undefined {
    return this.#strictRegex;
  }
  get prefixRegex(): RegExp | undefined {
    return this.#prefixRegex;
  }

  /**
   * checks if an uri strictly matches the route
   * for example /uri/myuri strictly matches /uri/myuri while /uri/myuri/he does not strictly matches
   * @param uri
   * @returns
   */
  isStrictMatch(uri: string) {
    return this.#strictRegex?.test(uri) || this.#strictRegex?.test(uri + "/");
  }

  /**
   * check if the uri is prefix of this route
   * @param uri
   * @returns
   */
  isPrefixMatch(uri: string) {
    //console.log("perfix regex: ", this.#prefixRegex);
    return this.#prefixRegex?.test(uri) ?? false;
  }
}

/**
 * helper class for parsing params
 */
export class ParamParser {
  partition: string;

  constructor(partition: string) {
    this.partition = partition;
  }
  isParam() {
    return this.partition.indexOf(":") == 0;
  }
  isRegex() {
    return (
      this.partition.indexOf("(") >= 0 &&
      ")" == this.partition[this.partition.length - 1]
    );
  }
  getParam() {
    return this.partition.slice(
      1,
      this.partition.includes("(")
        ? this.partition.indexOf("(")
        : this.partition.length
    );
  }
  getRegexString() {
    if (
      this.partition.lastIndexOf(")") != -1 ||
      this.partition.indexOf("(") != -1
    ) {
      return this.partition.slice(
        this.partition.indexOf("(") + 1,
        this.partition.lastIndexOf(")")
      );
    }
    return null;
  }
  getRegex() {
    return new RegExp(this.getRegexString() ?? "([^/]*)");
  }
}
