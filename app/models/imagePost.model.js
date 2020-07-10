const Joi = require('@hapi/joi')
const BaseModel = require('../utils/base-models')
const mongoose = require('mongoose')

module.exports = new BaseModel('imagePost', {
 path : Joi.string().required(),
 contentType : Joi.string().required(),
 uid : Joi.string().required(),
 url : Joi.string().required()
},

new mongoose.Schema({
  url : {
    type : String,
    required : true
  },
  path : {
    type : String,
    required : true
  },
  contentType : {
    type : String,
    required : true
  },
  uid : {
    type: String,
    required : true
  }
},{
  versionKey: false 
})
)