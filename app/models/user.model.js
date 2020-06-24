const Joi = require('@hapi/joi')
const BaseModel = require('../utils/base-models')
const mongoose = require('mongoose')
const { string } = require('@hapi/joi')

module.exports = new BaseModel('User', {
  titles : Joi.string().required(),  
  test : Joi.string()
},
new mongoose.Schema({
  titles : {
    type : String,
    required : true
  },
  test:{
    type:String,
    required:false
  }
},{
  versionKey: false // should be aware of the outcome after set to false
})
)