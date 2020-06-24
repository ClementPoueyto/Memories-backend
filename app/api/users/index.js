const { Router } = require('express')
const Notifications = require('./notifications')
const Posts = require('./posts')
const { User } = require('../../models')
const { isUserAdmin } = require('../../utils/jwt.utils')


const router = new Router()

router.use('/:uid/notifications', Notifications)
router.use('/:uid/posts', Posts)

//TODO CHECK TOKEN PRIVATE / ADMIN

router.get('/', (req, res) => {
  if (isUserAdmin(req.headers['authorization']) === true) {
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
})


router.get('/:uid', (req, res) => {
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
})


router.post('/', (req, res) => {
  if (isUserAdmin(req.headers['authorization']) === true) {
    const user = User.create({ ...req.body }, (error, user) => {
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


})

router.delete('/:uid', (req, res) => {
  if (isUserAdmin(req.headers['authorization']) === true) {
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
})

router.put('/:uid', (req, res) => {
  if (isUserAdmin(req.headers['authorization']) === true) {

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
})



module.exports = router