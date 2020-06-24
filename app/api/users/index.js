const { Router } = require('express')
const Notifications = require('./notifications')
const Posts = require('./posts')
const { User } = require('../../models')


const router = new Router()

router.use('/:uid/notifications', Notifications)
router.use('/:uid/posts', Posts)

//TODO CHECK TOKEN PRIVATE / ADMIN

router.get('/', (req, res) => {
  User.get((err,users)=>{
    if (users) {
      res.status(200).json(users)
    }
    else {
      res.status(400).json({ 'error': 'no users found' });
    }
  })
})


router.get('/:uid', (req, res) => {
  const id = req.params.uid
  if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
    User.getById(id,(error, user)=> {
      if (!user|| error) {
        (!user)?res.status(400).json({ 'error': 'no user found' }):res.status(400).json({ 'error': error });
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
  const user = User.create({ ...req.body },(error, user)=>{
    if (error||!user) {
      error?res.status(400).json({ 'error': error }):res.status(400).json({ 'error': "server failed to create user" });
    }
    else{
      res.status(201).json(user)
    }
  })
  

})

router.delete('/:uid', (req, res) => {
  User.delete(req.params.uid, (err,user)=>{
    if (!user || err) {
      res.status(400).json({ 'error': err });
    }
    else {
      res.status(200).send(user)
    }
  })
})

router.put('/:uid', (req, res) => {
  const id = req.params.uid
    User.update(id, req.body, function (err, user) {
  
      if (!user || err) {
        res.status(400).json({ 'error': err });
      }
      else {
        res.status(200).send(user)
      }
    })
})



module.exports = router