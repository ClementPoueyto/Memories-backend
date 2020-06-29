const Joi = require('@hapi/joi')
const BaseModel = require('../utils/base-models')
const mongoose = require('mongoose')

module.exports = new BaseModel('Notif', {

  //content : Joi.string().required(),  
  idFrom: Joi.string().required(),
  idTo: Joi.string().required(),
  date:  Joi.date().timestamp().required(),
  idRef: Joi.string().required(),
  seen: Joi.boolean().required(),
  textNotification : Joi.string().required(),
  types : Joi.string().required(),

},
new mongoose.Schema({
  idFrom : {
    type : String,
    required : true
  },
  idTo : {
    type : String,
    required : true
  },
  date : {
    type : Number,
    required : true
  },
  seen : {
    type : Boolean,
    required : true
  },
  textNotification : {
    type : String,
    required : true
  },
  types : {
    type : String,
    required : true
  },
  idRef : {
    type : String,
    required : true
  }
},{
  versionKey: false // should be aware of the outcome after set to false
}))