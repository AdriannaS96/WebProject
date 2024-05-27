const Datastore = require('gray-nedb');

class ProductDAO {
    constructor(dbFilePath) {
        const defaultFilePath = 'product.db';
        const filePath = dbFilePath || defaultFilePath;
        this.db = new Datastore({ filename: filePath, autoload: true });
        console.log('database connected: ' + filePath);
    }


    addProduct(type, quantity, expiryDate, res) {
        const product = {
            type: type,
            quantity: quantity,
            expiryDate: expiryDate
        };
    
        this.db.insert(product, function(err, doc) {
            if (err) {
                console.log('Error adding product:', err);
                res.status(500).send('Internal Server Error');
            } else {
                console.log('Product added to the database:', doc);
            }
        });
    }
    
    async findProduct(type, quantity, expiryDate) {
        try {
            const products = await new Promise((resolve, reject) => {
                this.db.find({ 
                    type: type,
                    quantity: quantity,
                    expiryDate: expiryDate 
                }, (err, products) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(products);
                    }
                });
            });
            return products;
        } catch (error) {
            console.error('Error finding products:', error);
            return [];
        }
    }

    getAllProducts() {
        return new Promise((resolve, reject) => {
            this.db.find({}, function(err, products) {
                if (err) {
                    reject(err);
                } else {
                    resolve(products);
                }
            });
        });
    }
    async deleteProductById(productId) {
        try {
            console.log('Attempting to delete product with ID:', productId); 
    
            const result = await new Promise((resolve, reject) => {
                this.db.remove({ _id: productId }, { multi: false }, (err, numRemoved) => {
                    if (err) {
                        console.error('Error deleting product:', err); 
                        reject({ success: false, message: 'Internal server error.' });
                    } else if (numRemoved === 0) {
                        console.log(`Product with ID ${productId} not found`); 
                        resolve({ success: false, message: `Product with ID ${productId} not found.` });
                    } else {
                        console.log(`Product with ID ${productId} deleted successfully`); 
                        resolve({ success: true, message: `Product with ID ${productId} deleted successfully.` });
                    }
                });
            });
            return result;
        } catch (error) {
            console.error('Error deleting product:', error); 
            return { success: false, message: 'Internal server error.' };
        }
    }
}

module.exports = ProductDAO;

