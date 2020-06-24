const Joi = require('@hapi/joi')
const BaseModel = require('../utils/base-models')
const mongoose = require('mongoose')

module.exports = new BaseModel('Client', {

  email : Joi.string().required(),  
  pseudo: Joi.string().required(),
  password : Joi.string().required(),
  isAdmin: Joi.number().required()

},
new mongoose.Schema({
  email : {
    type : String,
    required : true
  },
  pseudo : {
    type : String,
    required : true
  },
  password : {
    type : String,
    required : true
  },
  isAdmin : {
    type : Number,
    required : true
  }
},{
  versionKey: false // should be aware of the outcome after set to false
})
)