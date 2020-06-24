const { Router } = require('express')
const mongoose = require('mongoose')
const manageAllErrors = require('../../utils/routes/error-management')
const clientCtrl = require('./clientCtrl')

const router = new Router()

router.post('/',clientCtrl.register);


  
module.exports = router