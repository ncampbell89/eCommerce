const Product = require('../models/Product');
const formidable = require('formidable');
const path = require('path');

module.exports = {
  getProduct: id => { 
    // Get one product for display 
    return new Promise((resolve, reject) => {
      Product.findOne({ _id: id })
      .then(result => { resolve(result) })
      .catch(err => { reject(err) });
    })
  },
  getProducts: query => { 
    // Show all products OR search for products 
    const queryObj = {};
    
    return new Promise((resolve, reject) => {
      Product.find(queryObj)
      .then(results => { resolve(results) })
      .catch(err => { reject(err) });
    })
  },
  addProduct: (files, body) => {
    return new Promise((resolve, reject) => {
      const fileObject = files.file;     
      const filePath = path.join(__dirname, '../public/images/productimages/' + fileObject.name);
      console.log(filePath)
      
      fileObject.mv(filePath)
        .then(result => {
          console.log('move file')
          // if the file was saved automatically, also add the product to the database
          // get the relative filepath for where it WILL be stored relative to the public. So where it will be looked for from the browser.
          body.imgPath = '/images/productImages/' + fileObject.name;
          // Save the object to the database, with the filepath attached.
          
          console.log('Before its saving to db');
          console.log(body);
          
          Product.create(body)
            .then(product => { resolve(product) })
            .catch(err => { reject(err) })
        })
        .catch(err => { reject(err) })
    })

  },
  getProductById: (id) => {
      return new Promise((resolve, reject) => {
        Product.findById(id)
          .then(result => { resolve(result) })
          .catch(err => { reject(err) })
      })
  },

  updateProduct: (id, body) => {
    console.log('--------')
    console.log(body)
    return new Promise((resolve, reject) => {
      Product.findByIdAndUpdate(id, body, {new: true})
        .then(result => { resolve(result) })
        .catch(err => { reject(err) })
    })
  },

  deleteProduct: id => {
    // Delete a single product
    return new Promise((resolve, reject) => {
      Product.findOneAndDelete({ _id: id })
      .then(result => { resolve(result) })
      .catch(err => { reject(err) });
    })
  }
}