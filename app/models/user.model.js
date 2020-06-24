const Joi = require('@hapi/joi')
const BaseModel = require('../utils/base-models')
const mongoose = require('mongoose')

module.exports = new BaseModel('User', {
  _id : Joi.string().required(),
  firstName : Joi.string().required(),  
  lastName : Joi.string().required(),  
  followers : Joi.array().required(),  
  following : Joi.array().required(),  
  imageUrl : Joi.string().allow("").required(),  
  isPrivate : Joi.boolean().required(),
  pseudo : Joi.string().required(),
  posts : Joi.array().required() 

},
new mongoose.Schema({
  _id : {
    type : String,
    required : true
  },
  pseudo : {
    type: String,
    required : true
  },
  firstName : {
    type : String,
    required : true
  },
  lastName : {
    type : String,
    required : true
  },
  followers : {
    type : Array,
    required : true
  },  
  following : {
    type : Array,
    required : true
  },  
  imageUrl : {
    type : String,
    required : false,
  },
  isPrivate: {
    type : Boolean,
    required:true
  },
  posts : {
    type : Array,
    required : true
  }
},{
  versionKey: false // should be aware of the outcome after set to false
})
)