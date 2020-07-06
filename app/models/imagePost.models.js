const Joi = require('@hapi/joi')
const BaseModel = require('../utils/base-models')
const mongoose = require('mongoose')

module.exports = new BaseModel('imagePost', {
 path : Joi.string().required(),
 contentType : Joi.string().required(),
 image : Joi.any(),
 uid : Joi.string().required()
},

new mongoose.Schema({
  path : {
    type : String,
    required : true
  },
  contentType : {
    type : String,
    required : true
  },
  image : {
      type :mongoose.Schema.Types.Buffer,
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