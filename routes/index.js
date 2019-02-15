const express = require('express');
const router = express.Router();
const { authLocal, authJWT, generateToken } = require('../middleware/auth');
const ProductController = require('../controllers/ProductController');
const stripe = require('stripe')('sk_test_rcuW40YCvnAydOivyKCoruoR');

/* GET home page. */
router.get('/', (req, res) => {
  ProductController.getProducts()
    .then(prodData => {
      res.render('products', { title: 'Product Page', prodData: prodData })
    })
    .catch(err => {
      res.status(404).render('error', { message: 'Issue retrieving products', err })
    });
});

router.post('/checkout', (req, res) => {
  console.log('in checkout');
  console.log(req.body);
  const token = req.body.token;
  console.log(token);

  const totalPrice = req.body.cart.reduce((acc, item) => {
    return acc + item.price * item.count;
  }, 0);

  console.log(totalPrice);

  const charge = stripe.charges.create({
    amount: totalPrice,
    currency: 'usd',
    description: 'Example charge',
    source: 'tok_visa'
  });
  charge
    .then(resp => {
      console.log('in good charge');
      console.log(resp);
    })
    .catch(err => {
      console.log('in bad charge');
      console.log(err);
    });
});

router.get('/cart', (req, res) => {
  res.render('cart', { title: 'Checkout' });
});

router.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

router.get('/support', (req, res) => {
  res.render('support');
});

router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Sign Up' });
});

router.get('/signin', (req, res) => {
  res.render('signin', { title: 'Sign In' });
});

router.post('/signin', authLocal(), generateToken, (req, res) => {
  res.redirect('/');
});

router.get('/signout', (req, res) => {
  res.clearCookie('jwt');
  res.redirect('/');
});

module.exports = router;