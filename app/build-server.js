const cors = require('cors')
const morgan = require('morgan')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const { PORT,DB } = require('./server.configs')

const api = require('./api')

module.exports = (cb) => {
  const app = express()
  app.disable('x-powered-by')
  app.use(cors())
  app.use(bodyParser.json({limit:'50mb'}))
  app.use(morgan('[:date[iso]] :method :url :status :response-time ms - :res[content-length]'))
  app.use('/uploads',express.static('uploads'))
  app.use('/api', api)
  app.use('*', (req, res) => res.status(404).end())
  const server = app.listen(process.env.PORT || PORT, () => cb && cb(server))
  mongoose.connect(DB, {useNewUrlParser:true, useUnifiedTopology:true})
  const db = mongoose.connection; 
      db.on('error', console.error.bind(console, 'Erreur lors de la connexion')); 
      db.once('open', function (){
          console.log("Connexion à la base OK"); 
      }); 
}