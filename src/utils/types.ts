import {Request, Response} from "express";

export interface PublicApiEndpoint {
    path: string;
    type: MethodType;
    execute(request: Request, response: Response): void;
}

export interface PrivateApiEndpoint {
    path: string;
    type: MethodType;
    execute(request: Request, response: Response): void;
}

export interface ApiUser {
    sub: string,
    name: string,
    svr_pw: string
    exp: number
}

export enum MethodType {
    GET = "get",
    POST = "post",
    PUT = "put",
    DELETE = "delete"
}