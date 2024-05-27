const ProductModel = require('../models/productModel');
const ProductDAO = require('../models/productModel.js');
const Datastore = require('nedb');
const db = new Datastore({ filename: 'product.db', autoload: true });


const pantry = [
    { 
        username: 'Pantry1', 
        password: 'ada', 
        products: [] 
    },
    { 
        username: 'Pantry2', 
        password: 'password', 
        products: [] 
    }
    // You can add more pantries here
];

exports.lookup = function(username, callback) {
    console.log("Received username:", username);
    const pantryUser = pantry.find(pantry => pantry.username === username);
    console.log("Found pantry:", pantryUser);
    callback(null, pantryUser);
};



const pantryModel = {
    // Function to get reserved products
    getReservedProducts: async () => {
      return new Promise((resolve, reject) => {
        db.find({}, (err, reservedProducts) => {
          if (err) {
            reject(err);
          } else {
            resolve(reservedProducts);
          }
        });
      });
    },

    // Function to book and remove a product
    bookAndRemoveProduct: async (username, type, quantity, expiryDate, productDAO) => {

        const productDAOInstance = new ProductDAO('product.db')
        
        try {
            console.log('Received request to book and remove product:');
            console.log('Username:', username);
            console.log('Type:', type);
            console.log('Quantity:', quantity);
            console.log('Expiry Date:', expiryDate);

            // Find the product in the database
            const foundProducts = await productDAO.findProduct(type, quantity, expiryDate);

            if (foundProducts.length === 0) {
                throw new Error('Product not found in the database');
            }

            // Remove the found products from the database
            for (const foundProduct of foundProducts) {
                const deleteResult = await productDAO.deleteProductById(foundProduct._id);

                if (!deleteResult.success) {
                    throw new Error('Error deleting product from the database');
                }
            }

            return true; // Return true 
        } catch (error) {
            console.error('Error booking and removing product:', error);
            return false; // Return false 
        }
    }
};

module.exports = pantryModel;
