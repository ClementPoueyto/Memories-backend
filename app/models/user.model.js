const Joi = require('@hapi/joi')
const BaseModel = require('../utils/base-models')
const mongoose = require('mongoose')

module.exports = new BaseModel('User', {
  _id : Joi.string().required(),
  titles : Joi.string().required(),  
  isPrivate : Joi.boolean().required()
},
new mongoose.Schema({
  _id : {
    type : String,
    required : true
  },
  titles : {
    type : String,
    required : true
  },
  isPrivate:{
    type:Boolean,
    required:true
  }
},{
  versionKey: false // should be aware of the outcome after set to false
})
)