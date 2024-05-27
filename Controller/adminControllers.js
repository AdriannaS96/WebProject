// adminController.j
const adminModel = require('../models/adminModel');
const ProductDAO = require('../models/productModel.js');
const userModel = require('../models/userModel'); // Import userModel
const jwt = require("jsonwebtoken");

exports.Alogin = async (req, res) => {
    const { username, password } = req.body;
 
    try {
        const admin = adminModel.getAdminByUsername(username);
        if (admin && admin.password === password) {
            const payload = { username: username, role: 'admin' }
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 300 });
            res.cookie("jwt", accessToken);
            res.redirect('/adminB');
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};


exports.show_admin_login_page = (req, res) => {
    res.render('user/adminLogin');
};

exports.show_add_user_form = (req, res) => {
    res.render('addUserAdmin');
};

exports.deleteUser = async (req, res) => {
    try {
        const { username } = req.body;
        const result = await adminModel.deleteUserByUsername(username);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

const productDAO = new ProductDAO('product.db');

exports.delete_product = async (req, res) => {
    const { productId } = req.body;

    try {
        const deletedProduct = await productDAO.deleteProductById(productId);
        
        if (deletedProduct.success) {
            res.send(`Product "${productId}" deleted successfully`);
        } else {
            res.status(404).send(`Product "${productId}" not found`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

exports.post_new_user_ADMIN = function (req, res) {
    const user = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if (!user || !email || !password) {
      return res.status(400).send("Missing username, email, or password");
    }
    const hashedPassword = password;

    userModel.lookup(user, function (err, existingUser) {
      if (err) {
        return res.status(500).send("Internal Server Error");
      }
      if (existingUser) {
        return res.status(401).send("User already exists: " + user);
      }
      userModel.create(user, hashedPassword);
      console.log("Added user:", user);
      res.redirect("/adminB");
    });
};
