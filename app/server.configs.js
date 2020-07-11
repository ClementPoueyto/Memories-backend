const PORT  = 9428
//const PORT  =55924
const serverUrl = () => { return "https://localhost:"+PORT+"/" }
const DB = "mongodb://localhost/memories"
//const DB="mongodb://admin:mencelt123@ds255924.mlab.com:55924/heroku_w72qz2t4"
const AWS_SECRET_ACCESS ="NNl12SQDJmV30wS8wCvwyiEndgvFvG7zlwGPzZJj";

const AWS_ACCESS_KEY="AKIAI6YJ3WT57NZT7FQQ";
module.exports = { serverUrl, PORT, DB ,AWS_SECRET_ACCESS,AWS_ACCESS_KEY}