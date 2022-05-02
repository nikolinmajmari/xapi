
/**
 * Exported http status codes based on documentation of 
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */
export class HttpConstants{
    /// 200 status codes 

    /**
     * @description
     * The request succeeded. The result meaning of "success" depends on the HTTP method:
     * GET: The resource has been fetched and transmitted in the message body.
     * HEAD: The representation headers are included in the response without any message body.
     * PUT or POST: The resource describing the result of the action is transmitted in the message body.
     * TRACE: The message body contains the request message as received by the server.
     */
    static httpStatusOk = {status:200,statusText:"success"} as StatusCodeInterface;
    
    /**
     * The request succeeded, and a new resource was created as a result. This is typically
     *  the response sent after POST requests, or some PUT requests.
     */
    static httpStatusCreated = {status:201,statusText:"created"} as StatusCodeInterface;
    
    /**
     * The request has been received but not yet acted upon. It is noncommittal, since there is no way in HTTP to later send an asynchronous response indicating the outcome of the request. 
     * It is intended for cases where another process or server handles the request, or for batch processing.
     */
    static httpStatusAccepted = {status: 202,statusText:"accepted"} as StatusCodeInterface;
    
    /**
     * This response code means the returned metadata is not exactly the same as is available from the origin server, but is collected from a local or a third-party copy. 
     * This is mostly used for mirrors or backups of another resource. Except for that specific case, the 200 OK response is preferred to this status.
     */
    static httpStatusNonAutorativeInformation = {status :203,statusText:"Non-Authoritative Information"} as StatusCodeInterface;
    
    /**
     * There is no content to send for this request, but the headers may be useful. The user agent may update its cached headers for this resource with the new ones.
     */
    static httpStatusNoContent = {status:204,statusText:"No Content"} as StatusCodeInterface;
    
    /**
     * Tells the user agent to reset the document which sent this request
     */
    static httpStatusResetContent = {status:205,statusText:"Reset Content"} as StatusCodeInterface;
    
    /**
     * This response code is used when the Range header is sent from the client to request only part of a resource.
     */
    static httpStatusPartialContent = {status:206,statusText:"Partial Content"} as StatusCodeInterface;

    /// 300 status codes Redirection 


    /**
     * The request has more than one possible response. The user agent or user should choose one of them. (There is no standardized way of choosing one of the responses, but HTML links to the possibilities are recommended so the user can pick.)
     */
    static httpStatusMultipleChoices = {status:300,statusText:"Multiple Choices"} as StatusCodeInterface;
    
    /**
     * The URL of the requested resource has been changed permanently. The new URL is given in the response.
     */
    static httpStatusMovedPermanently = {status:301,statusText:"Moved Permanently"} as StatusCodeInterface;
    
    /**
     * This response code means that the URI of requested resource has been changed temporarily. Further changes in the URI might be made in the future. Therefore, this same URI should be used by the client in future requests.
     */
    static httpStatusFound = {status:302,statusText:"Found"} as StatusCodeInterface;
    
    /**
     * The server sent this response to direct the client to get the requested resource at another URI with a GET request.
     */
    static httpStatusSeeOther = {status:303,statusText:"See Other"} as StatusCodeInterface;
    
    /**
     * This is used for caching purposes. It tells the client that the response has not been modified, so the client can continue to use the same cached version of the response.
     */
    static httpStatusNotModified = {status:304,statusText:"Not Modified"} as StatusCodeInterface;
    
    /**
     * The server sends this response to direct the client to get the requested resource at another URI with same method that was used in the prior request. This has the same semantics as the 302 Found HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
     */
    static  httpStatusTemporyRedirect = {status:307,statusText:"Tempory Redirect"} as StatusCodeInterface;

    /**
     * The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
     */
    static httpStatusBadRequest = {status:400,statusText:"Bad Request"} as StatusCodeInterface;

    /**
     * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
     */
    static httpStatusUnauthorized = {status:401,statusText:"Unauthorized"}as StatusCodeInterface;

    /**
     * This response code is reserved for future use. The initial aim for creating this code was using it for digital payment systems, however this status code is used very rarely and no standard convention exists.
     */
    static httpStatusPaymentRequired = {status:402,statusText:"Payment Required"}as StatusCodeInterface;

    /**
     * The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401 Unauthorized, the client's identity is known to the server.
     */
    static httpStatusForbidden = {status:403,statusText:"Forbidden"}as StatusCodeInterface;


    /**
     * The server can not find the requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 Forbidden to hide the existence of a resource from an unauthorized client. This response code is probably the most well known due to its frequent occurrence on the web.
     */
    static httpStatusNotFound = {status:404,statusText:"Not Found"} as StatusCodeInterface;

    /**
     * The request method is known by the server but is not supported by the target resource. For example, an API may not allow calling DELETE to remove a resource.
     */
    static httpStatusMethodNotAllowed = {status:405,statusText:"Method Not Allowed"} as StatusCodeInterface;

    /**
     * This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content that conforms to the criteria given by the user agent.
     */
    static httpStatusNotAcceptable = {status:406,statusText:"Not Acceptable"} as StatusCodeInterface;

    /**
     * This is similar to 401 Unauthorized but authentication is needed to be done by a proxy.
     */
    static httpStatusProxyAuthenticationRequired = {status:407,statusText:"Proxy Authentication Required"} as StatusCodeInterface;

    /**
     * This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message.
     */
    static httpStatusRequestTimeout = {status:408,statusText:"Request Timeout"} as StatusCodeInterface;

    /**
     * This response is sent when a request conflicts with the current state of the server.
     */
    static httpStatusConflict = {status:409,statusText:"Conflict"} as StatusCodeInterface;

    /**
     * This response is sent when the requested content has been permanently deleted from server, with no forwarding address. Clients are expected to remove their caches and links to the resource. The HTTP specification intends this status code to be used for "limited-time, promotional services". APIs should not feel compelled to indicate resources that have been deleted with this status code.
     */
    static httpStatusGone = {status:410,statusText:"Gone"} as StatusCodeInterface;

    /**
     * Server rejected the request because the Content-Length header field is not defined and the server requires it.
     */
    static httpStatusLengthRequired = {status:411,statusText:"Length Required"} as StatusCodeInterface;

    /**
     * The client has indicated preconditions in its headers which the server does not meet.
     */
    static httpStatusPreconditionFailed = {status:412,statusText:"Precondition Failed"} as StatusCodeInterface;

    /**
     * Request entity is larger than limits defined by server. The server might close the connection or return an Retry-After header field.
     */
    static httpStatusPayloadTooLarge = {status:413,statusText:"Payload too large"} as StatusCodeInterface;

    /**
     * The URI requested by the client is longer than the server is willing to interpret.
     */
    static httpStatusUriTooLong = {status:414,statusText:"URI Too Long"} as StatusCodeInterface;

    /**
     * The media format of the requested data is not supported by the server, so the server is rejecting the request.
     */
    static httpStatusUnsupportedMediaType = {status:415,statusText:"Unsupported Media Type"} as StatusCodeInterface;

    /**
     * The range specified by the Range header field in the request cannot be fulfilled. It's possible that the range is outside the size of the target URI's data.
     */
    static httpStatusRangeNotStatisfiable = {status:416,statusText:"Range Not Statisfiable"} as StatusCodeInterface;

    /**
     * This response code means the expectation indicated by the Expect request header field cannot be met by the server.
     */
    static httpStatusExpectationFailed = {status:417,statusText:"Expectation Failed"} as StatusCodeInterface;

    /**
     * The server refuses the attempt to brew coffee with a teapot.
     */
    static httpStatusImaTeapot = {status:418,statusText:"I'm a teapot"} as StatusCodeInterface;

    /**
     * The request was well-formed but was unable to be followed due to semantic errors.
     */
    static httpStatusUnprocessableEntity = {status:422,statusText:"Unprocessable Entity"} as StatusCodeInterface;

    /**
     * Indicates that the server is unwilling to risk processing a request that might be replayed.
     */
    static httpStatusTooEarly = {status:425,statusText:"Too Early"} as StatusCodeInterface;

    /**
     * The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol. The server sends an Upgrade header in a 426 response to indicate the required protocol(s).
     */
    static httpStatusUpgradeRequired  ={status:426,statusText:"Upgrade Required"} as StatusCodeInterface;

    /**
     * The origin server requires the request to be conditional. This response is intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.
     */
    static httpStatusPreconditionRequired = {status:428,statusText:"Precondition Required"} as StatusCodeInterface;

    /**
     * The user has sent too many requests in a given amount of time ("rate limiting").
     */
    static httpStatusTooManyRequest = {status:429,statusText:"Too Many Requests"} as StatusCodeInterface;

    /**
     * The server is unwilling to process the request because its header fields are too large. The request may be resubmitted after reducing the size of the request header fields.
     */
    static httpStatusRequestHeaderFieldsTooLarge = {status:431,statusText:"Request Header Fields Too Large"} as StatusCodeInterface;

    /**
     * The user agent requested a resource that cannot legally be provided, such as a web page censored by a government.
     */
    static httpStatusUnavailableForLegalReasons = {status:451,statusText:"Unavailable For Legal Reasons"} as StatusCodeInterface;

    //// server error responses 

    /**
     * The server has encountered a situation it does not know how to handle.
     */
    static httpStatusIntealServerError = {status:500,statusText:"Ineral Server Error"} as StatusCodeInterface;

    /**
     * The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.
     */
    static httpStatusNotImplemented = {status:501,statusText:"Not Implemented"} as StatusCodeInterface;

    /**
     * This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.
     */
    static httpStatusBadGateway = {status:502,statusText:"Bad Gateway"} as StatusCodeInterface;

    /**
     * The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This response should be used for temporary conditions and the Retry-After HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.
     */
    static httpStatusServiceUnavailable = {status:503,statusText:"Service Unavailable"} as StatusCodeInterface;

    /**
     * This error response is given when the server is acting as a gateway and cannot get a response in time.
     */
    static httpStatusGatewayTimeout = {status:504,statusText:"Gateway Timeout"} as StatusCodeInterface;

    /**
     * The HTTP version used in the request is not supported by the server.
     */
    static httpStatusHttpVersionNotSupported = {status:505,statusText:"Http Version Not Supported"} as StatusCodeInterface;

    /**
     * The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.
     */
    static httpStatusVariantAlsoNegotiates = {status:506,statusText:"Variant Also Negotiates"} as StatusCodeInterface;

    /**
     * The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.
     */
    static httpStatusInsufficientStorage = {status:507,statusText:"Insuficient Storage"} as StatusCodeInterface;

    /**
     * The server detected an infinite loop while processing the request.
     */
    static httpStatusLoopDetected = {status:508,statusText:"Loop Detected"} as StatusCodeInterface;

    /**
     * Further extensions to the request are required for the server to fulfill it.
     */
    static httpStatusNotExtended = {status:510,statusText:"Not Extended"} as StatusCodeInterface;
    
    /**
     *Indicates that the client needs to authenticate to gain network access. 
     */
    static httpStatusNetworkAuthenticationRequired = {status:511,statusText:"Network Authentication Required"} as StatusCodeInterface;
}

/**
 * Represents a status code 
 */
export interface StatusCodeInterface{
    /// status code 
    status:number;
    /// status text 
    statusText:string|undefined;
}