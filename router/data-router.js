const express = require('express');

const data = require('./data-model')

const router = express.Router();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const multer = require("multer")

// router.use(cors({ origin: "*" }));
// router.use(bodyParser.json());

router.post('/register', (req, res) => {
  let user = req.body
  let hash = bcrypt.hashSync(user.password,13)
  user.online = false
  user.password = hash 
  data.register(user)
  .then(project => {
    res.status(201).json(project)
   })
.catch(err => {
res.status(500).json({ message: 'Failed to get schemes' })
})

})
router.post('/login', (req, res) => {
  let body = req.body
  data.login(body)
  .first()
  .then(user => {
    const payload = {
      userid:user.id,
      username:user.first_name
    }
    const options = {
      expiresIn:"1d"
    }
    const token = jwt.sign(payload,"secret",options)
    if (user && bcrypt.compareSync(body.password,user.password))
    {res.status(201).json({ id:user.id,name:user.first_name + " " + user.last_name,picture:user.picture,token:token})}
   else {
     res.status(404).json({message:`invalid creditinials`})
   }
  })
  .catch(err => {
    res.status(500).json({ message: err })
    console.log(err)
  });
});
router.get('/users', (req, res) => {
  data.getUsers()
.then(data => {
  res.status(200).json(data);
})
.catch(err => {
  res.status(500).json({ message: 'Failed to get projects' });
})
})
router.post('/orders', (req, res) => {
  var today = new Date();
  req.body.delivered = false
  data.purchase(req.body)
  .then(project => {
    res.status(201).json(project)
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get schemes' });
  });
})
router.get('/orders', (req, res) => {
  var today = new Date();
  req.body.delivered = false
  data.getOrders()
  .then(project => {
    res.status(200).json(project)
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get schemes' });
  });
})


module.exports = router