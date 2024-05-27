const userDao = require("../models/userModel.js");
const ProductModel = require("../models/productModel.js");
const auth = require('../auth/auth.js');


const productModel = new ProductModel("product.db");


exports.show_login = function (req, res) {
  res.render("user/login");
};


exports.handle_login = function(req, res, next) {
    auth.login(req, res, function(err) {
        if (err) {
        
            console.error("error:", err);
            return res.status(500).json({ message: "error" });
        }

        res.redirect("/addProduct"); 
    });
};


exports.show_products = function(req, res) {
  productModel.getAllProducts()
    .then(products => {
      res.render("products", { title: "Products", products: products });
    })
    .catch(error => {
      console.log("Error fetching products:", error);
      res.status(500).send("Internal Server Error");
    });
};


exports.show_add_product_form = function(req, res) {
  res.render('addProduct'); 
};

exports.add_new_product = function(req, res) {
  const type = req.body.type;
  const quantity = req.body.quantity;
  const expiryDate = req.body.expiryDate;

  if (!type || !quantity || !expiryDate) {
      return res.status(400).send("Missing type, quantity, or expiry date");
  }

// Checking the expiration date
  const currentDate = new Date();
  if (new Date(expiryDate) <= currentDate) {
      return res.status(400).send("Expiry date must be in the future");
  }

  productModel.addProduct(type, quantity, expiryDate, function(err, newProduct) {
      if (err) {
          console.log("Error adding new product:", err);
          return res.status(500).send("Internal Server Error");
      }
   
      res.redirect("products");
  });
};


exports.show_adminB = function (req, res) {
  res.render("adminB");
};

exports.show_register_page = function (req, res) {
  res.render("user/register");
};

exports.show_index = function (req, res) {
  res.render("index"); 
};


exports.show_aboutUs = function (req, res) {
  res.render("aboutUs"); 
};


exports.show_ContactUs = function (req, res) {
  res.render("ContactUs"); 
};


exports.post_new_user = function (req, res) {
  const user = req.body.username;
  const email = req.body.email;
  const password = req.body.password;


  if (!user || !email || !password) {
    return res.status(400).send("Missing username, email, or password");
  }


  const hashedPassword = password;

  userDao.lookup(user, function (err, existingUser) {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    if (existingUser) {
      return res.status(401).send("User already exists: " + user);
    }


    userDao.create(user, hashedPassword);
    console.log("Registered user:", user);
    res.redirect("/login");
  });
};


exports.logout = function (req, res) {
  res.clearCookie("jwt")
  .status(200)
  .redirect("/");
};

