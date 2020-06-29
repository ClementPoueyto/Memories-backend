const PORT  = 9428
const serverUrl = () => { return "https://memories.osc-fr1.scalingo.io/" }
const DB = "mongodb://admindb:adminMemories@34183965-0160-4f9e-b1b6-ff88f03fbd48.memories-3384.mongo.dbs.scalingo.com:32389/memories-3384?replicaSet=memories-3384-rs0&ssl=true"

/*const serverUrl = () => { return "http://localhost:"+PORT+"/" }
const DB = "mongodb://localhost/memories"*/

module.exports = { serverUrl, PORT, DB }