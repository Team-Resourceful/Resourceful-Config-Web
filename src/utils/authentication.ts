import {NextFunction, Request, Response} from "express";
import {Database} from "./database";
import {ApiUser} from "./types";
import {Config} from "./config";
import Jwt, {Algorithm, JwtPayload} from "jsonwebtoken";

export class Authentication {

    private static database: Database = new Database(Config.database);

    public static revokeUser(request: Request): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.getUser(request)
                .then(user => {
                    Authentication.database.query("INSERT IGNORE INTO `revoked` (`uuid`, `expire`) VALUES (?)",
                        [[user.sub, user.exp]])
                        .then(() => resolve())
                        .catch(() => reject())
                })
                .catch(() => reject())
        })

    }

    public static getUser(request: Request): Promise<ApiUser> {
        return new Promise<ApiUser>((resolve, reject) => {
            const authorization = request.headers.authorization;
            if (authorization) {
                const code = authorization.split(" ")[1];
                if (code) {
                    Jwt.verify(code,
                        Config.jwt.public,
                        {
                            algorithms: [Config.jwt.algo as Algorithm]
                        },
                        (err, decoded) => {
                            if (decoded) {
                                const token = decoded as JwtPayload
                                Authentication.database.query("select `uuid`, `expire` from `revoked` where `uuid` = ? and `expire` = ?",
                                    [token.sub, token.exp])
                                    .then((results) => {
                                        if (results && results.length > 0) {
                                            reject({
                                                status: 403,
                                                message: "Token has been revoked"
                                            })
                                        } else {
                                            resolve(token as ApiUser)
                                        }
                                    })
                                    .catch(() => reject({
                                        status: 500,
                                        message: "Internal authentication error"
                                    }))
                            } else {
                                reject({
                                    status: 403,
                                    message: "Invalid token"
                                })
                            }
                        }
                    );
                } else {
                    reject({
                        status: 400,
                        message: "Invalid authorization header"
                    });
                }
            } else {
                reject({
                    status: 400,
                    message: "Missing authorization header"
                });
            }
        });
    }

    public static basic(request: Request, response: Response, next: NextFunction) {
        Authentication.getUser(request)
           .then(() => next())
           .catch(error => response.status(error.status).json({
               message: error.message
           }))
    }
}