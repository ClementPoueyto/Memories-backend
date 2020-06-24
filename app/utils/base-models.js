const fs = require('fs')
const Joi = require('@hapi/joi')
const logger = require('../utils/logger.js')
const ValidationError = require('./errors/validation-error.js')
const NotFoundError = require('./errors/not-found-error.js')
const mongoose = require('mongoose')
const manageAllErrors = require('./routes/error-management.js')


module.exports = class BaseModel {
  constructor(name, schema, mongooseSchema) {
    if (!name) throw new Error('You must provide a name in constructor of BaseModel')
    if (!schema) throw new Error('You must provide a schema in constructor of BaseModel')
    if (!mongooseSchema) throw new Error('You must provide a Mongoose schema in constructor of BaseModel')

    this.mongooseModel = mongoose.model(name, mongooseSchema)
    this.schema = Joi.object().keys({ ...schema })
    this.items = []
    this.name = name
    this.dir = __dirname
    this.load()
  }

  load() {
    try {
      this.mongooseModel.find({}, (error, users) => {
        if (error) {
          manageAllErrors(res, error)
          return
        }
        this.items = users
      })

    } catch (err) {
      if (err.message === 'Unexpected end of JSON input') logger.log(`Warning :s wrong JSON format`)
    }
  }

  get(callback) {
    return this.mongooseModel.find({}, (error, res) => {
      if (error) {
        return callback(error, null)
      }
      if (!res) {
        return callback("no users", null)
      }
      this.items = res
      return callback(null, this.items)
    })
  }

  getById(id, callback) {
    return this.mongooseModel.findById({ _id: id }, (error, res) => {
      if (!res || error) {
        return error ? callback(error, null) : callback("no user found", null)
      }
      else {
        return callback(null, res)
      }
    })

  }

  create(obj = {}, callback) {
    const item = { ...obj }
    const { error } = this.schema.validate(item)
    if (error) return callback(`Create Error : Object ${JSON.stringify(obj)} does not match schema of model ${this.name}`, null)
    this.items.push(item)
    this.mongooseModel.create(item, function (err, res) {
      if (err) return callback(err, null)
      return callback(null, res.toObject())
    })
  }

  update(id, obj, callback) {
    if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
      this.mongooseModel.findById({ _id: id }, (error, res) => {
        if (!res || error) {
          return (error) ? callback(error, null) : callback("no user found", null)
        }
        else {
          const updatedItem = { ...res.toObject(), ...obj }
          console.log(updatedItem)
          const { error } = this.schema.validate(updatedItem)
          if (error) return callback(`Create Error : Object ${JSON.stringify(updatedItem)} does not match schema of model ${this.name}`, null)
          this.mongooseModel.replaceOne({ _id: id }, updatedItem, (error, res) => {
            if (!res || error) {
              return (error) ? callback(error, null) : callback("server error", null)
            }
            else {
              callback(null, updatedItem)
            }
          })
        }
      })
    }
    else {
      return callback("bad id", null)
    }


  }

  delete(id, callback) {
    if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
      this.mongooseModel.findOneAndRemove({_id:id},{useFindAndModify:false},(err,res)=>{
        if(err || !res){
         return err?callback(err,null):callback("no user found", null)
        }
        else{
          return callback(null,res)
        }
      })
    }
    else{
      return callback("bad id",null)
    }
  }
}
