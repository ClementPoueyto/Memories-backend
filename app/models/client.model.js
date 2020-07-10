const Joi = require('@hapi/joi')
const BaseModel = require('../utils/base-models')
const mongoose = require('mongoose')

module.exports = new BaseModel('Client', {

  email : Joi.string().required(),  
  password : Joi.string().required(),
  isAdmin: Joi.boolean().required(),
  token : Joi.string().required(),
  pushToken  :Joi.string().allow("")

},
new mongoose.Schema({
  email : {
    type : String,
    required : true
  },
  password : {
    type : String,
    required : true
  },
  isAdmin : {
    type : Boolean,
    required : true
  },
  token : {
    type : String,
    required :true
  },
  pushToken : {
    type : String,
    required : false
  }
},{
  versionKey: false // should be aware of the outcome after set to false
})
)