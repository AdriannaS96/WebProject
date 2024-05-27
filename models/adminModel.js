const admins = [
    { username: 'PantriesAdmin', password: '2743214' }
    //  add more administrators
];

exports.getAdminByUsername = function(username) {
    return admins.find(admin => admin.username === username);
};

exports.lookup = function(username, password, callback) {
    const admin = admins.find(admin => admin.username === username && admin.password === password);
    callback(null, admin);
};


const Datastore = require('nedb');


const db = new Datastore({ filename:'user.db', autoload: true });

// Function to delete a user based on username
exports.deleteUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        // Remove the user from the database based on the username
        db.remove({ username }, { multi: false }, (err, numRemoved) => {
            if (err) {
                reject({ success: false, message: 'Internal server error.' });
            } else if (numRemoved === 0) {
                resolve({ success: false, message: `User ${username} not found.` });
            } else {
                resolve({ success: true, message: `User ${username} deleted successfully.` });
            }
        });
    });
};
