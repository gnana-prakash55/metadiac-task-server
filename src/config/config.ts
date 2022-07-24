import dotenv from "dotenv";

dotenv.config();

const HOSTNAME = process.env.HOSTNAME || "localhost"
const PORT = process.env.HOSTNAME || 5000
const MONGODB_URI = process.env.MONGODB_URI || ""


const SERVER = {
    hostname: HOSTNAME,
    port: PORT
}

const config = {
    server: SERVER,
    dBURI: MONGODB_URI
}

export default config;

