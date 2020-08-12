const express = require('express');

const data = require('./data-model')
const stripe = require("stripe")("sk_test_NoFhpUlZ3MLrBsMFOmVdsnXW00wxvpx0eU");
const router = express.Router();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const cors = require("cors")
const uuid = require("uuid/v4");
// router.use(cors({ origin: "*" }));
// router.use(bodyParser.json());
router.use(cors());

router.post('/register', (req, res) => {
  console.log(req.body)
  let user = req.body
  let hash = bcrypt.hashSync(user.password,13)
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
  console.log(body)
  data.login(body)
  .first()
  .then(user => {
    console.log(user)
    const payload = {
      userid:user.id,
      username:user.username
    }
    const options = {
      expiresIn:"1d"
    }
    const token = jwt.sign(payload,"secret",options)
    if (user && bcrypt.compareSync(body.password,user.password))
    {res.status(200).json({email:body.email,token:token,userid:user.id,first_name:user.first_name,last_name:user.last_name})}
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
  console.log(req.body)
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
router.post("/checkout", (req, res) => {
 

  
    const { product, token } = req.body;
    console.log("Request:", product);
    console.log("price:", product.price);
    const idempotencyKey = uuid();
    return stripe.customers.create({
      email: token.email,
      source: token.id
    }).then(
      customer => {
        stripe.charges.create(
          {
            amount: product.price * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: `Purchased the ${product.name}`,
            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
                postal_code: token.card.address_zip
              }
            }
          },
          {
            idempotencyKey
          }
        );
      }
    )
    .then(project => {
      console.log("usd")
      res.status(200).json(project)})
    .catch(err => {
      res.status(500).json(console.log(err));
    });
 
})

module.exports = router