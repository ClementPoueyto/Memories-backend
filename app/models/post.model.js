const Joi = require('@hapi/joi')
const BaseModel = require('../utils/base-models')
const Comment = require('./comment.model')
const mongoose = require('mongoose')

module.exports = new BaseModel('Post', {

  uid : Joi.string().required(),  
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  imageUrl: Joi.string().allow(''),
  isPrivate: Joi.boolean().required(),
  likes: Joi.array().items(Joi.string()).required(),
  comments: Joi.array().items(Joi.object()).required(),
  position: 
    {
      longitude: Joi.number(),
      latitude: Joi.number()
  }
    ,
  adress : Joi.string().allow(''),
  date : Joi.date().timestamp().required(),
},
new mongoose.Schema({
  uid : {
    type : String,
    required : true
  },
  title : {
    type : String,
    required : true
  },
  description : {
    type : String,
    required : false
  },
  imageUrl : {
    type : String,
    required : false
  },
  isPrivate : {
    type : Boolean,
    required : true
  },
  likes : {
    type : Array,
    required : true
  },
  comments : {
    type : Array,
    required : true
  },
  position : {
    type : Object,
    required : false
  },
  adress : {
    type : String,
    required : false
  },
  date : {
    type : Number,
    required : true
  }
},{
  versionKey: false // should be aware of the outcome after set to false
}))