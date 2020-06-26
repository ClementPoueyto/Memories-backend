const Joi = require('@hapi/joi')
const BaseModel = require('../utils/base-models')
const mongoose = require('mongoose')

module.exports = new BaseModel('Comment', {
  _id : Joi.string().required(),
  uid : Joi.string().required(),  
  textComment: Joi.string().required(),
  date : Joi.date().timestamp().required(),
},
new mongoose.Schema({
  _id : {
    type : String,
    required : true
  },
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
},{
  versionKey: false // should be aware of the outcome after set to false
}))