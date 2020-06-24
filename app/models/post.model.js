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
  position: [
        Joi.number().required(),
        Joi.number().required()
    ],
  adress : Joi.string().allow(''),
  date : Joi.date().timestamp().required(),
},
new mongoose.Schema({
  titles : {
    type : String,
    required : true
  }
}))