const jwtUtils = require('../../utils/jwt.utils.js')
const { User } = require('../../models')

module.exports = {
    getAllUsers: function (req, res) {
        if (jwtUtils.isUserAdmin(req.headers['authorization']) === true) {
            User.get((err, users) => {
                if (users) {
                    res.status(200).json(users)
                }
                else {
                    res.status(400).json({ 'error': 'no users found' });
                }
            })
        }
        else {
            res.status(404).json({ 'error': 'not allowed' });
        }
    },
    getUser: function (req, res) {
        const id = req.params.uid
        if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
            User.getById(id, (error, user) => {
                if (!user || error) {
                    (!user) ? res.status(400).json({ 'error': 'no user found' }) : res.status(400).json({ 'error': error });
                }
                else {
                    res.status(200).send(user)
                }
            })
        }
        else {
            res.status(400).json({ 'error': 'bad id' });
        }
    },

    getMyFollowers : function (req, res) {
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        if (userId.length <= 1) {
            return res.status(400).json({
                'error': 'wrong token'
            })
        }
            User.mongooseModel.find({following: userId}, (error, users) => {
                if (!users || error) {
                    (!users) ? res.status(400).json({ 'error': 'no user found' }) : res.status(400).json({ 'error': error });
                }
                else {
                    res.status(200).send(users)
                }
            })
    },
    getMyFollowing : function (req, res) {
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        if (userId.length <= 1) {
            return res.status(400).json({
                'error': 'wrong token'
            })
        }
            User.mongooseModel.find({followers: userId}, (error, users) => {
                if (!users || error) {
                    (!users) ? res.status(400).json({ 'error': 'no user found' }) : res.status(400).json({ 'error': error });
                }
                else {
                    res.status(200).send(users)
                }
            })
    },

    createUser: function (req, res) {
        if (jwtUtils.isUserAdmin(req.headers['authorization']) === true) {
            const user = {
                _id: req.body.uid.toString(),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                pseudo: req.body.pseudo,
                imageUrl: "",
                followers: [req.body.uid.toString()],
                following: [],
                isPrivate: false,
                posts: []
            }
            User.create(user, (error, user) => {
                if (error || !user) {
                    error ? res.status(400).json({ 'error': error }) : res.status(400).json({ 'error': "server failed to create user" });
                }
                else {
                    res.status(201).json(user)
                }
            })
        }
        else {
            res.status(404).json({ 'error': 'not allowed' });
        }
    },
    deleteUser: function (req, res) {
        if (jwtUtils.isUserAdmin(req.headers['authorization']) === true) {
            User.delete(req.params.uid, (err, user) => {
                if (!user || err) {
                    res.status(400).json({ 'error': err });
                }
                else {
                    res.status(200).send(user)
                }
            })
        }
        else {
            res.status(404).json({ 'error': 'not allowed' });
        }
    },

    updateUser: function (req, res) {
        if (jwtUtils.isUserAdmin(req.headers['authorization']) === true) {

            const id = req.params.uid
            User.update(id, req.body, function (err, user) {

                if (!user || err) {
                    res.status(400).json({ 'error': err });
                }
                else {
                    res.status(200).send(user)
                }
            })
        }
        else {
            res.status(404).json({ 'error': 'not allowed' });
        }
    },

    getUserProfile: function (req, res) {
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        if (userId.length <= 1) {
            return res.status(400).json({
                'error': 'wrong token'
            })
        }

        User.mongooseModel.findById(userId, (err, client) => {
            if (client) {
                res.status(200).json(client)
            }
            else {
                err ? res.status(400).json({ 'error': err }) : res.status(404).json({ "error": "no user found" })
            }
        })
    },
    updateUserProfile: function (req, res) {
        //Getting auth header
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);
        if (userId.length <= 1) {
            return res.status(400).json({
                'error': 'wrong token'
            })
        }

        const pseudo = req.body.pseudo
        const firstName = req.body.firstName
        const lastName = req.body.lastName
        const isPrivate = req.body.isPrivate
        const imageUrl = req.body.imageUrl

        if (firstName == null && lastName == null && pseudo == null && isPrivate == null && imageUrl == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        if (firstName && (firstName.length >= 20 || firstName.length < 1)) {
            return res.status(400).json({ 'error': 'wrong first name (must be length 2 - 20)' })
        }
        if (lastName && (lastName.length >= 20 || lastName.length < 1)) {
            return res.status(400).json({ 'error': 'wrong last name (must be length 2 - 20)' })
        }

        if (pseudo && (pseudo.length >= 20 || pseudo.length <= 4)) {
            return res.status(400).json({ 'error': 'wrong pseudo (must be length 5 -20)' })
        }

        if (imageUrl && (imageUrl.length < 1 || imageUrl.length > 500)) {
            return res.status(400).json({ 'error': 'wrong image url (must be length max 500)' })
        }

        User.mongooseModel.findOne({ pseudo: pseudo })
            .then(function (userFound) {
                if (!userFound) {

                    let itemToUpdate = {}
                    if (firstName != null) itemToUpdate = { ...itemToUpdate, firstName: firstName }
                    if (lastName != null) itemToUpdate = { ...itemToUpdate, lastName: lastName }
                    if (imageUrl != null) itemToUpdate = { ...itemToUpdate, imageUrl: imageUrl }
                    if (pseudo != null) itemToUpdate = { ...itemToUpdate, pseudo: pseudo }
                    if (isPrivate != null) itemToUpdate = { ...itemToUpdate, isPrivate: isPrivate }

                    User.update(userId, itemToUpdate, (err, updated) => {
                        if (err || !res) {
                            err ? res.status(400).json({ 'error': err }) : res.status(404).json({ "error": "no user found" })
                        }
                        else {
                            res.status(200).json(updated)
                        }
                    })

                }
                else {
                    res.status(400).json({ 'error': 'pseudo already taken' })
                }
            })
    },

    followUser : function (req, res) {
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);
        if (userId.length <= 1) {
            return res.status(400).json({
                'error': 'wrong token'
            })
        }
        const uidToFollow = req.params.uid
        if (!(typeof uidToFollow === 'string' && uidToFollow.match(/^[0-9a-fA-F]{24}$/))) {
            return res.status(400).json({ 'error': 'bad id' });
        }

        if(userId === uidToFollow){
            return res.status(400).json({ 'error': "can't follow yourself" });
        }

        User.getById(userId, (error, user)=>{
            if (error || !user) {
                error ? res.status(400).json({ 'error': error }) : res.status(400).json({ 'error': "no user found" });
            }
            else {
                User.getById(uidToFollow, (error, userToFollow)=>{
                    if (error || !userToFollow) {
                        error ? res.status(400).json({ 'error': error }) : res.status(400).json({ 'error': "no user found to follow" });
                    }
                    else {
                        let following1 = user.following
                        let followers2 = userToFollow.followers
                        let message =""

                        const index2 = followers2.indexOf(userId)
                        if(index2!=-1){
                            //si follow deja -> unfollow
                            const index1 = following1.indexOf(uidToFollow)
                            following1.splice(index1,1)
                            followers2.splice(index2,1)
                            message="unfollow"
                        }
                        else{
                            following1.push(uidToFollow)
                            followers2.push(userId)
                            message = "follow"
                        }

                        User.update(uidToFollow, {followers : followers2} ,(err, result)=>{
                            if (err || !result) {
                                err ? res.status(400).json({ 'error': err }) : res.status(400).json({ 'error': "no user found" });
                            }
                            else{
                                User.update(userId, {following : following1}, (err, result)=>{
                                    if (err || !result) {
                                        err ? res.status(400).json({ 'error': err }) : res.status(400).json({ 'error': "no user found" });
                                    }
                                    else{
                                        res.status(200).send(result)
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    },

    searchUser : function (req, res) {
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);
        if (userId.length <= 1) {
            return res.status(400).json({
                'error': 'wrong token'
            })
        }

        const pseudoToSearch = req.params.pseudo
        User.mongooseModel.find({pseudo: pseudoToSearch}, (error, users) => {
            if (!users || error) {
                (!users) ? res.status(400).json({ 'error': 'no user found' }) : res.status(400).json({ 'error': error });
            }
            else {
                res.status(200).send(users)
            }
        })
    }
}