import {MethodType, PrivateApiEndpoint} from "../../utils/types";
import {Request, Response} from "express";
import {Authentication} from "../../utils/authentication";

export default {
    path: "verify",
    type: MethodType.GET,
    execute(request: Request, response: Response) {
        Authentication.getUser(request)
            .then(user => {
                response.status(200).json({
                    valid: true,
                    user
                })
            })
            .catch(error => response.status(error.status).json({
                valid: false,
                message: error.message
            }))
    }
} as PrivateApiEndpoint