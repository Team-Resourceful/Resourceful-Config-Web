import express from "express";
import {Authentication} from "./utils/authentication";
import {readdir} from "fs/promises";
import {PrivateApiEndpoint, PublicApiEndpoint} from "./utils/types";
import {Config} from "./utils/config";

const app = express()

app.use("/", express.static("public", {
    extensions: ["html"]
}))
app.use("/api/v1/private", Authentication.basic)

readdir("./dist/paths/public")
    .then(r => r.filter(file => file.endsWith(".js")))
    .then(files => files.forEach(async file => {
        const endpoint: PublicApiEndpoint = (await import(`./paths/public/${file}`)).default;
        app.route(`/api/v1/public/${endpoint.path}`)[endpoint.type](endpoint.execute)
    }))

readdir("./dist/paths/private")
    .then(r => r.filter(file => file.endsWith(".js")))
    .then(files => files.forEach(async file => {
        const endpoint: PrivateApiEndpoint = (await import(`./paths/private/${file}`)).default;
        app.route(`/api/v1/private/${endpoint.path}`)[endpoint.type](endpoint.execute)
    }))

app.get("/", (req,res) => res.sendFile(process.cwd() + "/public/index.html"));

app.listen(Config.server.port)

console.log(`Listening on port: http://localhost:${Config.server.port}`)