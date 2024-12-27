const { Sequelize } = require('sequelize');

// Replace with your database details
const sequelize = new Sequelize('sys', 'root', 'Kevin123!', {
  host: 'localhost',
  dialect: 'mysql', // Use 'mysql' since we're connecting to a MySQL database
});

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
