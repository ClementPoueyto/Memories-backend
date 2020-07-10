const bcrypt = require('bcrypt')
const jwtUtils = require('../../utils/jwt.utils.js')
const { Client, User } = require('../../models')

//constants
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

module.exports = {
    register: function (req, res) {
        const email = req.body.email
        const pseudo = req.body.pseudo
        const password = req.body.password
        const firstName = req.body.firstName
        const lastName = req.body.lastName


        if (email == null || pseudo == null || password == null || firstName == null || lastName == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ 'error': 'wrong email' })
        }

        if (pseudo.length >= 20 || pseudo.length < 4) {
            return res.status(400).json({ 'error': 'wrong pseudo (must be length 4 - 20)' })
        }

        if (firstName.length >= 20 || firstName.length < 1) {
            return res.status(400).json({ 'error': 'wrong first name (must be length 2 - 20)' })
        }
        if (lastName.length >= 20 || lastName.length < 1) {
            return res.status(400).json({ 'error': 'wrong last name (must be length 2 - 20)' })
        }

        Client.mongooseModel.findOne({ email: email }).then(function (userFound) {
            if (!userFound) {
                User.mongooseModel.findOne({ pseudo: pseudo.toLowerCase() }).then(function (pseudoFound) {
                    if (!pseudoFound) {
                        bcrypt.hash(password, 5, function (err, bcryptPassword) {
                            Client.create({
                                email: email,
                                password: bcryptPassword,
                                isAdmin: false,
                                token : 'noToken'
                            }, (err, client) => {
                                if (client && !err) {
                                    const user = {
                                        _id: client._id.toString(),
                                        firstName: firstName,
                                        lastName: lastName,
                                        pseudo: pseudo.toLowerCase(),
                                        imageUrl: "",
                                        followers: [client._id.toString()],
                                        following: [],
                                        isPrivate: false,
                                    }
                                    User.create(user, (error, user) => {
                                        if (error || !user) {
                                            error ? res.status(400).json({ 'error': error }) : res.status(400).json({ 'error': "server failed to create user" });
                                        }
                                        else {
                                            return res.status(201).json({
                                                'uid': client._id
                                            })
                                        }
                                    })
                                }
                                else {
                                    return res.status(500).json({ 'error': err })
                                }
                            })
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
        const password = req.body.password
        if (email == null || password == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        Client.mongooseModel.findOne({ email: email })
            .then(function (userFound) {

                if (userFound) {
                    bcrypt.compare(password, userFound.password, function (errBcrypt, resBcrypt) {
                        if (resBcrypt) {
                            const token = jwtUtils.GenerateTokenForUser(userFound)
                            const payload ={
                                '_id': userFound._id,
                                'token': token,
                                'isAdmin' :userFound.isAdmin,
                                'email' : userFound.email
                            }

                            Client.update(userFound._id.toString(), {token:token}, (err, updated) => {
                                if (err || !updated) {
                                    err ? res.status(400).json({ 'error': err }) : res.status(404).json({ "error": "no user found" })
                                }
                                else {
                                    return res.status(200).json(payload);
                                }
                            })

                        }
                        else {
                            return res.status(403).json({ 'error': 'invalid password' });

                        }
                    })
                }
                else {
                    return res.status(400).json({ 'error': 'no user found' });

                }
            }


            ).catch(function (err) {
                return res.status(500).json({ "error": "unable to verify user" })
            });
    },

    getClientProfile: function (req, res) {
        //Getting auth header

        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        if (userId.length <= 1) {
            return res.status(400).json({
                'error': 'wrong token'
            })
        }

        Client.mongooseModel.findById(userId, { password: 0 }, (err, client) => {
            if (client) {
                res.status(200).json(client)
            }
            else {
                err ? res.status(400).json({ 'error': err }) : res.status(404).json({ "error": "no user found" })
            }
        })
    },

    updateClientProfile: function (req, res) {
        //Getting auth header
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);
        if (userId.length <= 1) {
            return res.status(400).json({
                'error': 'wrong token'
            })
        }

        const email = req.body.email
        const password = req.body.password
        const pushToken = req.body.pushToken


        if (email == null && password == null && pushToken == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        if (email && !EMAIL_REGEX.test(email)) {
            return res.status(400).json({ 'error': 'wrong email' })
        }
       
        Client.mongooseModel.findOne({ _id: userId })
            .then(function (userFound) {
                if (userFound) {

                    let itemToUpdate = {}
                    if (email != null) itemToUpdate = { ...itemToUpdate, email: email }
                    if(password!=null){
                        bcrypt.hash(password, 5, function (err, bcryptPassword){

                        if (bcryptPassword != null) itemToUpdate = { ...itemToUpdate, password: bcryptPassword }
                        })
                    }
                    if(pushToken!=null){
                        itemToUpdate = { ...itemToUpdate, pushToken : pushToken}
                    }
                    Client.update(userId, itemToUpdate, (err, updated) => {
                        if (err || !res) {
                            err ? res.status(400).json({ 'error': err }) : res.status(404).json({ "error": "no user found" })
                        }
                        else {
                            res.status(200).json(updated)
                        }
                    })
                }
                else{
                    res.status(400).json({'error' : 'no user found'})

                }
            })
        
    },

    getNewToken : function (req, res) {
        const headerAuth = req.headers['authorization'];
        const token = jwtUtils.parseAuthorization(headerAuth);
        if(token!=null){
            try{
                Client.mongooseModel.findOne({token:token}).then(function (client){
                    if(!client){
                        return res.status(400).json({'error':'please log out'})
                    }
                    const newToken =jwtUtils.GenerateTokenForUser(client)
                    const payload = {
                        'uid': client._id,
                        'token': newToken
                    }
                    Client.update(client._id.toString(),{token : newToken},(err, updated)=>{
                        if(err||!updated){
                            err ? res.status(400).json({ 'error': err }) : res.status(500).json({ 'error': "server failed to update client" });

                        }
                        else{
                            return res.status(200).json(payload);

                        }
                    })
                    
                })
                }
                
            catch(err){
                return res.status(400).json({'error':err})

            }
        }
        else{
            return res.status(400).json({'error':'no token'})

        }
    }

}