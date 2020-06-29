const { Router } = require('express')
const mongoose = require('mongoose')
const versionCtrl = require('./versionCtrl')

const router = new Router()

router.get('/', versionCtrl.getVersion)

module.exports = router;