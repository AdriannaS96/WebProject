const express = require('express');
const router = express.Router();
const controller = require('../Controller/projectControllers.js');
const { login, verify, verifyAdmin, verifyPantry } = require('../auth/auth'); 
const adminControllers = require('../Controller/adminControllers.js'); 
const pantryController = require('../Controller/pantryController');

// user
router.get('/', controller.show_index);
router.get('/products', controller.show_products);
router.get('/aboutUs', controller.show_aboutUs);
router.get('/ContactUs', controller.show_ContactUs);
router.get('/pantryLogin', pantryController.show_pantry_login_page);  
router.get('/login', controller.show_login);
router.post('/login', login, controller.handle_login);
router.get('/register', controller.show_register_page);
router.post('/register', controller.post_new_user);
router.get('/logout', verify, controller.logout);
router.get('/deleteUser', (req, res) => {
    res.render('deleteUser'); 
});

router.get('/deleteProd', (req, res) => {
    res.render('deleteProd'); 
});

router.get('/pantry/login', (req, res) => {
    res.redirect('/pantryB');
});

router.get('/pantryB',verifyPantry, pantryController.showPantryB);


 router.get('/pantryB', pantryController.showPantryB);

router.post('/admin/products/delete', adminControllers.delete_product);

// Admin
router.get('/adminB', verifyAdmin, controller.show_adminB);
router.get('/adminLogin', adminControllers.show_admin_login_page); 
router.post('/admin/login', adminControllers.Alogin); 
router.get('/addUserAdmin', adminControllers.show_add_user_form); 
router.post('/addUserAdmin', adminControllers.post_new_user_ADMIN); 
router.post('/admin/users/delete', adminControllers.deleteUser);

router.get('/addProduct', verify, controller.show_add_product_form);
router.post('/addProduct', verify, controller.add_new_product);

router.post('/pantry/bookAndRemoveProduct', pantryController.bookAndRemoveProduct);

router.use((req, res, next) => {
    res.status(404).send('404 Not found.');
});

module.exports = router;
