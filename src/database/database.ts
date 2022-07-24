import mongoose from "mongoose";
import config from "../config/config";
import logging from "../config/logging"

const NAMESPACE = "Database"

const db =  mongoose.connect( config.dBURI ,{

})
.then(() => {
    logging.info(NAMESPACE,`MetaDiac MongoDB Server Connected`)
})
.catch((err) => {
    console.log(err)
    logging.error(NAMESPACE,`MetaDiac MongoDB Server not Connected `)
})

export { db };