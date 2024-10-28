const db = require('./db');


const UserModel = {
  getAllUsers: (callback) => {
    db.query('SELECT * FROM employee', (err, results) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, results);
    });
  },
};

module.exports = UserModel;
