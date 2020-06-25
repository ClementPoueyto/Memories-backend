const Joi = require('@hapi/joi')
const BaseModel = require('../utils/base-models')
const mongoose = require('mongoose')

module.exports = new BaseModel('Comment', {

  uid : Joi.string().required(),  
  textComment: Joi.string().required(),
  date : Joi.date().timestamp().required(),
},
new mongoose.Schema({
  uid : {
    type : String,
    required : true
  },
  textComment : {
    type : String,
    required : true
  },
  date : {
    type : Number,
    required : true
  }
}))