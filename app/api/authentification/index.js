const { Router } = require('express')
const mongoose = require('mongoose')
const manageAllErrors = require('../../utils/routes/error-management')
const clientCtrl = require('./clientCtrl')

const router = new Router()

// No condition
router.post('/signin',clientCtrl.register);

router.post('/login',clientCtrl.login);

router.get('/token', clientCtrl.getNewToken)


//TOKEN User
router.get('/me',clientCtrl.getClientProfile);

router.put('/me',clientCtrl.updateClientProfile);



  
module.exports = router