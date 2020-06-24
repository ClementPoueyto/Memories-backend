const Joi = require('@hapi/joi')
const BaseModel = require('../utils/base-models')
const mongoose = require('mongoose')

module.exports = new BaseModel('Comment', {

  uid : Joi.string().required(),  
  textComment: Joi.string().required(),
  date : Joi.date().timestamp().required(),
},
new mongoose.Schema({
  titles : {
    type : String,
    required : true
  }
}))