const { Router } = require('express')
const mongoose = require('mongoose')
const manageAllErrors = require('../../utils/routes/error-management')
const clientCtrl = require('./clientCtrl')

const router = new Router()

router.post('/signin',clientCtrl.register);
router.post('/login',clientCtrl.login);
router.get('/me',clientCtrl.getClientProfile);
router.put('/me',clientCtrl.updateClientProfile)



  
module.exports = router