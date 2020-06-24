const Joi = require('@hapi/joi')
const BaseModel = require('../utils/base-models')
const mongoose = require('mongoose')

module.exports = new BaseModel('Notif', {

  content : Joi.string().required(),  
  idFrom: Joi.string().required(),
  idTo: Joi.string().required(),
  date:  Joi.date().timestamp().required(),
  ref: Joi.string().required(),
  seen: Joi.boolean().required(),
  textNotification : Joi.string().required(),
  types : Joi.string().required(),

},
new mongoose.Schema({
  titles : {
    type : String,
    required : true
  }
}))