export enum HttpMethod {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
  ALL = "ALL",
}
/**
 * @property path   holds the uri of the resource
 * @property method holds the http method
 * @property params holds the request params
 */
export interface RoutingContextInterface {
  url: URL;
  path: string;
  method: HttpMethod;
  params: {[key: string]: string | number};
}

export class RoutingContext<T> implements RoutingContextInterface {
  context: T;
  url: URL;
  path: string;
  method: HttpMethod;
  params: {[key: string]: string | number};
  constructor(context: T, url: URL, method: HttpMethod) {
    this.context = context;
    this.url = url;
    this.method = method;
    this.params = {};
    const path = this.url.pathname;
    if (path.length > 0) {
      if (path[path.length - 1] != "/") {
        this.path = path + "/";
      }
    }
    this.path = path;
  }
}

export interface RoutingContextInterfaceFactory<T> {
  createRoutingContextFrom(context: T): RoutingContext<T>;
}
