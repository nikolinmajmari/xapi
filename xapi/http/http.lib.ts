import { ServerRequest } from "https://deno.land/std@0.104.0/http/server.ts";

export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
    ALL = "ALL"
}

