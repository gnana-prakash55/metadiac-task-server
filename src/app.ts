import http from "http";
import express from "express";
import logging from "./config/logging";
import config from "./config/config";
import { db } from "./database/database";
import { masterRouter } from "./routes";
import cors from "cors";

const NAMESPACE = "Server";
const app = express();

// loggig result
app.use((req, res, next) => {
    logging.info(NAMESPACE,`METHOD - [${req.method}], URL - [${req.url}],IP - [${req.socket.remoteAddress}]`)

    res.on('finish', () => {
        logging.info(NAMESPACE,`METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`)
    })
    next();
})

app.use(cors())
app.use(express.urlencoded({ extended: false}))
app.use(express.json())


app.use('/api/v1', masterRouter)


async function START_SERVER() {

    await db;

    app.listen(config.server.port, () => {
    logging.info(NAMESPACE,`Server Running on ${config.server.hostname}:${config.server.port}`)
})
}

START_SERVER()

