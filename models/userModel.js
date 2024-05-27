const nedb = require('gray-nedb');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class UserDAO {
    constructor() {

        this.db = new nedb({ filename: 'user.db', autoload: true });
    }
    
    async create(username, password) {
        try {
            const hash = await bcrypt.hash(password, saltRounds);
            var entry = {
                user: username,
                password: hash
            };
            console.log("Attempting to insert user:", entry); 
            await this.db.insert(entry); 
            console.log("User inserted successfully."); 
        } catch (err) {
            console.log("Error creating user:", err);
            throw err; // Pass the error up so it can be handled in the controller
        }
    }
    
    
    lookup(user, cb) {
        this.db.find({ 'user': user }, function (err, entries) {
            if (err) {
                console.log("Error looking up user:", err);
                return cb(err, null); // Pass the error to the callback
            } else {
                if (entries.length == 0) {
                    return cb(null, null); // No user found
                }
                return cb(null, entries[0]); // Return the first found user
            }
        });
    }
}

const dao = new UserDAO();

module.exports = dao;
