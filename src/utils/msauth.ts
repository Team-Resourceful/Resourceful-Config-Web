import { env } from "node:process";
import axios from "axios";

export class MsAuth {

    public static async getAccount(code: string): Promise<MinecraftAccount> {
        const msToken = await MsAuth.getMicrosoftTokens(code);
        const xbl = await MsAuth.getXboxLiveToken(msToken);
        const xsts = await MsAuth.getXstsToken(xbl);
        const mcAuth = await MsAuth.getMinecraftToken(xbl, xsts);
        return MsAuth.getMinecraftAccount(mcAuth);
    }

    private static getMinecraftAccount(mcAuth: MinecraftAuthResponse): Promise<MinecraftAccount> {
        return new Promise<MinecraftAccount>((resolve, reject) => {
            axios("https://api.minecraftservices.com/minecraft/profile", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${mcAuth.access_token}`
                }
            })
            .then(res => {
                if (res.data.error) {
                    reject(res.data.errorMessage)
                } else {
                    resolve(res.data as MinecraftAccount)
                }
            })
            .catch(reject)
        })
    }

    private static getMicrosoftTokens(code: string): Promise<string> {
        const params = new URLSearchParams();
        params.append("client_id", env.MS_CLIENT as string);
        params.append("client_secret", env.MS_SECRET  as string);
        params.append("code", code);
        params.append("grant_type", "authorization_code");
        params.append("redirect_uri", env.MS_URL as string);

        return new Promise<string>((resolve, reject) => {
            axios("https://login.live.com/oauth20_token.srf", {
                method: "POST",
                data : params,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(res => {
                if (res.data.error) {
                    reject(res.data.error_description)
                } else {
                    resolve(res.data.access_token)
                }
            }).catch(reject)
        })
    }

    private static getXboxLiveToken(msToken: string): Promise<XboxLiveAuthResponse> {
        const body = JSON.stringify({
            "Properties": {
                "AuthMethod": "RPS",
                "SiteName": "user.auth.xboxlive.com",
                "RpsTicket": `d=${msToken}`
            },
            "RelyingParty": "http://auth.xboxlive.com",
            "TokenType": "JWT"
        })
        return new Promise<XboxLiveAuthResponse>((resolve, reject) => {
            axios("https://user.auth.xboxlive.com/user/authenticate", {
                method: "POST",
                data: body,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
            .then(res => resolve(res.data as XboxLiveAuthResponse))
            .catch(reject)
        })
    }

    private static getXstsToken(xboxLiveResponse: XboxLiveAuthResponse): Promise<XSTSAuthResponse> {
        const body = JSON.stringify({
            "Properties": {
                "SandboxId": "RETAIL",
                "UserTokens": [`${xboxLiveResponse.Token}`]
            },
            "RelyingParty": "rp://api.minecraftservices.com/",
            "TokenType": "JWT"
        })

        return new Promise<XSTSAuthResponse>((resolve, reject) => {
            axios("https://xsts.auth.xboxlive.com/xsts/authorize", {
                method: "POST",
                data: body,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
            .then(res => {
                if (res.data.XErr) {
                    reject(res.data.Message)
                } else {
                    resolve(res.data as XSTSAuthResponse)
                }
            })
            .catch(reject)
        })
    }

    private static getMinecraftToken(xboxLiveResponse: XboxLiveAuthResponse, xstsResponse: XSTSAuthResponse): Promise<MinecraftAuthResponse> {
        const body = JSON.stringify({
            "identityToken": `XBL3.0 x=${xboxLiveResponse.DisplayClaims.xui[0].uhs};${xstsResponse.Token}`
        })

        return new Promise<MinecraftAuthResponse>((resolve, reject) => {
            axios("https://api.minecraftservices.com/authentication/login_with_xbox", {
                method: "POST",
                data: body,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
            .then(res => resolve(res.data as MinecraftAuthResponse))
            .catch(reject)
        })
    }

}

export interface XboxLiveAuthResponse {
    IssueInstant: string,
    NotAfter: string,
    Token: string,
    DisplayClaims: {
        xui: [
            {
                uhs: string
            }
        ]
    }
}

export interface XSTSAuthResponse {
    IssueInstant: string,
    NotAfter: string,
    Token: string,
    DisplayClaims: {
        xui: [
            {
                uhs: string
            }
        ]
    }
}

export interface MinecraftAuthResponse {
    username: string,
    roles: [],
    access_token: string,
    token_type: string,
    expires_in: 86400
}

export interface MinecraftAccount {
    id : string,
    name: string,
    skins: [
        {
            id: string,
            state: string,
            url: string,
            variant: string,
            alias: string
        }
    ],
    capes: []
}