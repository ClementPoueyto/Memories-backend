const { Router } = require('express')
const router = new Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Client, User } = require('../../models')


module.exports = {
    register: function (req, res) {
        const email = req.body.email
        const pseudo = req.body.pseudo
        const password = req.body.password

        if (email == null || pseudo == null || password == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        Client.mongooseModel.findOne({ email: email }).then(function (userFound) {
            if (!userFound) {
                Client.mongooseModel.findOne({ pseudo: pseudo }).then(function (pseudoFound) {
                    if (!pseudoFound) {
                        bcrypt.hash(password, 5, function (err, bcryptPassword) {
                            const newClient = Client.create({
                                email: email,
                                pseudo: pseudo,
                                password: bcryptPassword,
                            })
                            if (newClient) {
                                console.log(Client.items.length)
                                return res.status(201).json({
                                    'uid': newClient.id
                                })
                            }
                            else {
                                return res.status(500).json({ 'error': 'cannot add client' })
                            }
                        })

                    }
                    else {
                        return res.status(409).json({ 'error': 'pseudo already exist' })

                    }
                })
            }
            else {
                return res.status(409).json({ 'error': 'user already exist' })
            }

        })


    },

    login: function (req, res) {
        const email = req.body.email
        const pseudo = req.body.pseudo
        const password = req.body.password

    }
}