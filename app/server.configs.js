const PORT  = 9428
const serverUrl = () => { return "http://localhost:"+PORT+"/" }
const DB = "mongodb://localhost/memories"

module.exports = { serverUrl, PORT, DB }