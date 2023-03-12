import {readFileSync} from "fs";
let ConfigInternal: ConfigData | null = null;

function loadConfig(): ConfigData {
    if (!ConfigInternal) {
        const data = readFileSync(process.cwd() + "/config.json");
        if (data) {
            ConfigInternal = JSON.parse(data.toString()) as ConfigData;
        } else {
            throw new Error("Could not load config json.")
        }
    }
    return ConfigInternal;
}

export const Config = loadConfig();

export interface ConfigData {
    database: DatabaseData,
    microsoft: MicrosoftData,
    jwt: JwtData,
    server: ServerData
}

export interface DatabaseData {
    database: string,
    host: string,
    password: string,
    port: number,
    user: string
}

export interface MicrosoftData {
    secret: string,
    client: string,
    url: string
}

export interface JwtData {
    algo: string,
    private: string,
    public: string
}

export interface ServerData {
    port: number
}
