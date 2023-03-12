import {MethodType, PrivateApiEndpoint} from "../../utils/types";
import {Request, Response} from "express";
import {Authentication} from "../../utils/authentication";

export default {
    path: "revoke",
    type: MethodType.DELETE,
    execute(request: Request, response: Response) {
        Authentication.revokeUser(request)
            .then(() => {
                response.status(200).json({ revoked: true })
            })
            .catch(error => response.status(400).json({ revoked: false }))
    }
} as PrivateApiEndpoint