import {MethodType, PublicApiEndpoint} from "../../utils/types";
import {Request, Response} from "express";
import {MsAuth} from "../../utils/msauth";
import Jwt, {Algorithm} from "jsonwebtoken";
import { env } from "node:process";

export default {
    path: "mslogin",
    type: MethodType.GET,
    execute(request: Request, response: Response) {
        const authorization = request.headers.authorization;
        if (authorization) {
            const code = authorization.split(" ")[1];
            if (code) {
                if (request.query && request.query.svr_pw) {
                    MsAuth.getAccount(code)
                        .then(account => {
                            const uuid = account.id.substr(0, 8) + "-" + account.id.substr(8, 4) + "-" + account.id.substr(12, 4) + "-" + account.id.substr(16, 4) + "-" + account.id.substr(20);
                            response.status(200).json({
                                token: Jwt.sign(
                                    {
                                        name: account.name,
                                        svr_pw: request.query.svr_pw
                                    },
                                    env.JWT_SECRET as string,
                                    {
                                        algorithm: env.JWT_ALGO as Algorithm,
                                        subject: uuid,
                                        expiresIn: "2h"
                                    }
                                )
                            })
                        }).catch(reason => {
                            response.status(400).json({error: "Failed to get account from code."})
                            console.log(reason)
                        })
                } else {
                    response.status(400).json({error: "Missing server password"})
                }
            } else {
                response.status(400).json({error: "Malformed authorization header"})
            }
        } else {
            response.status(400).json({error: "Missing authorization header."})
        }
    }
} as PublicApiEndpoint