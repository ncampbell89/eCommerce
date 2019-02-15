const router = require('express').Router();
const path = require('path');
const ProductController = require('../controllers/ProductController');

router.get('/CMS', (req, res) => {
  ProductController.getProducts()
  .then(result => {
    console.log(result)
    res.render('products', { prodData: result, title: 'CMS products' });
  })
  .catch(err => {
    res.status(400).json({ message: 'No product found' });
  }); 
})

router.get('/addProduct', (req, res) => {
  res.render('addProductForm', { title: 'Add Product' });
});

router.post('/addProduct', (req, res) => {
  ProductController.addProduct(req.files, req.body)
    .then(result => { 
//      res.json({ message: 'successfully added product' });
      res.render('ProductAdded', { title: 'Product Added' });
    })
    .catch(err => {
//      res.json({ message: 'error in adding product' });
      res.render('error', { title: 'No Product Added' });
    });
});


router.get('/editProduct/:id', (req, res) => {
  console.log(req.params.id)
  ProductController.getProductById(req.params.id)
    .then(result => {
      res.render('editProductForm', { title: 'Edit Product', productData: result })
    })
    .catch(err => {
      res.status(404).render('error', { title: 'Unable to Change Product', message: 'Cannot edit product', error: err })
    })
});

router.post('/editProduct/:id', (req, res) => {
  ProductController.updateProduct(req.params.id, req.body)
    .then(result => {
      // res.json({ message: 'Product Updated' })
      res.render('ProductUpdated', { title: 'Product Updated', productData: result })
    })
    .catch(err => {
      // res.status(400).json({ message: 'Could not update product' })
      res.status(404).render('error', { title: 'No Product Changed', message: 'Unable to save changes', error: err });
    })
})

router.delete('/deleteProduct/:id', (req, res) => {
  ProductController.deleteProduct(req.params.id, req.body)
  .then(result => {
    res.redirect('/')
  })
  .catch(err => {
    res.status(404).render('error', { title: 'Cannot remove', message: 'Unable to remove product', error: err })
  })
})

router.get('/testForm', (req, res) => {
  res.render('fileExample');
});

router.post('/testForm', (req, res) => {
  console.log(req.files.image);
  console.log(req.body.text);

  let sampleFile = req.files.image;

  let filePath = path.join(__dirname, '../public/images/productImages/') + sampleFile.name;
  console.log(filePath);
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(filePath, function(err) {
    if (err) return res.status(500).send(err);
    res.send('File uploaded!');
  });

  // res.send('After console log');
});

module.exports = router;