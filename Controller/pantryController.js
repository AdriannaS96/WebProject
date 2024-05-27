const pantryModel = require('../models/pantryModel');
const productModel = require('../models/productModel.js'); 
const ProductDAO = require('../models/productModel.js'); 
const jwt = require("jsonwebtoken");


exports.Plogin = async (req, res) => {
    const { username, password } = req.body;

    try {

        const pantry = pantryModel.lookup(username, password);


        if (pantry && pantry.password === password) {
     
            const payload = { username: username, role: 'pantry' }; 
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 300 });
            
  
            res.cookie("jwt", accessToken);
            res.redirect('/pantryB');
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};


exports.show_pantry_login_page = (req, res) => {
    res.render('user/pantryLogin');
};



exports.show_pantry_login_page = (req, res) => {
    res.render('user/pantryLogin');
};


exports.bookAndRemoveProduct = async (req, res) => {
    try {
        const { username, type, quantity, expiryDate } = req.body;

        // Create an instance of ProductDAO
        const productDAOInstance = new ProductDAO('product.db');

        // Call function from Pantry model to book and remove product
        const result = await pantryModel.bookAndRemoveProduct(username, type, quantity, expiryDate, productDAOInstance);

        if (result) {
            // Get the list of reserved products after successful operation
            const reservedProducts = await pantryModel.getReservedProducts(username);

            // Redirect user to reserved products page
            res.render('pantryB', { reservedProducts });
        } else {
            // Handle error in case of operation failure
            res.status(500).send('Error booking and removing product');
        }
    } catch (error) {
        // Handle error
        console.error('Error handling request:', error);
        res.status(500).send('An error occurred while processing the request');
    }
};

exports.showPantryB = async (req, res) => {
    try {
        // Get the list of reserved products
        const reservedProducts = await pantryModel.getReservedProducts();

        // Render the template and pass the reserved products
        res.render('pantryB', { reservedProducts });
    } catch (error) {
        console.error('Error fetching reserved products:', error);
        res.status(500).send('An error occurred while processing the request');
    }
};
