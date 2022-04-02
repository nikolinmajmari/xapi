export interface XapiRequestInterface {
  /**
   * Returns the cache mode associated with request, which is a string
   * indicating how the request will interact with the browser's cache when
   * fetching.
   */
  readonly cache: RequestCache;
  /**
   * Returns the credentials mode associated with request, which is a string
   * indicating whether credentials will be sent with the request always, never,
   * or only when sent to a same-origin URL.
   */
  readonly credentials: RequestCredentials;
  /**
   * Returns the kind of resource requested by request, e.g., "document" or "script".
   */
  readonly destination: RequestDestination;
  /**
   * Returns a Headers object consisting of the headers associated with request.
   * Note that headers added in the network layer by the user agent will not be
   * accounted for in this object, e.g., the "Host" header.
   */
  readonly headers: Headers;
  /**
   * Returns request's subresource integrity metadata, which is a cryptographic
   * hash of the resource being fetched. Its value consists of multiple hashes
   * separated by whitespace. [SRI]
   */
  readonly integrity: string;
  /**
   * Returns a boolean indicating whether or not request is for a history
   * navigation (a.k.a. back-forward navigation).
   */
  readonly isHistoryNavigation: boolean;
  /**
   * Returns a boolean indicating whether or not request is for a reload
   * navigation.
   */
  readonly isReloadNavigation: boolean;
  /**
   * Returns a boolean indicating whether or not request can outlive the global
   * in which it was created.
   */
  readonly keepalive: boolean;
  /**
   * Returns request's HTTP method, which is "GET" by default.
   */
  readonly method: string;
  /**
   * Returns the mode associated with request, which is a string indicating
   * whether the request will use CORS, or will be restricted to same-origin
   * URLs.
   */
  readonly mode: RequestMode;
  /**
   * Returns the redirect mode associated with request, which is a string
   * indicating how redirects for the request will be handled during fetching. A
   * request will follow redirects by default.
   */
  readonly redirect: RequestRedirect;
  /**
   * Returns the referrer of request. Its value can be a same-origin URL if
   * explicitly set in init, the empty string to indicate no referrer, and
   * "about:client" when defaulting to the global's default. This is used during
   * fetching to determine the value of the `Referer` header of the request
   * being made.
   */
  readonly referrer: string;
  /**
   * Returns the referrer policy associated with request. This is used during
   * fetching to compute the value of the request's referrer.
   */
  readonly referrerPolicy: ReferrerPolicy;
  /**
   * Returns the signal associated with request, which is an AbortSignal object
   * indicating whether or not request has been aborted, and its abort event
   * handler.
   */
  readonly signal: AbortSignal;
  /**
   * Returns the URL of request as a string.
   */
  readonly url: string;

  clone(): Request;

  /** A simple getter used to expose a `ReadableStream` of the body contents. */
  readonly body: string | Uint8Array | null | {[key: string]: any};
}

export interface XapiResponseInterface {
  /**
   *
   * @param status set the status code of the response to sent
   * @returns
   */
  withStatusCode(status: number): XapiResponseInterface;
  /**
   *
   * @param headers add headers to the response to sent, typical are the cokie headers
   * @returns
   */
  withHeaders(headers: {[key: string]: string}): XapiResponseInterface;
  /**
   *
   * @param body Add the body of the request
   * @returns
   */
  withBody(body: BodyInit): XapiResponseInterface;
  /**
   *
   * @param text Add the status text of the response
   * @returns
   */
  withStatusText(text: string): XapiResponseInterface;

  /**
   * end the response and sent it. After you call end you can not sent any response
   */
  end(): Promise<void>;
  /**
   * Endable
   * @param content
   */
  send(body: BodyInit | null | undefined, init: ResponseInit): Promise<void>;

  redirect(url: string): Promise<void>;

  json(content: {}): Promise<void>;
}
