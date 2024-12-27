const sequelize = require('./sequelize'); // Adjust the path as needed
const Todo = require('./todo');

(async () => {
  try {
    await sequelize.sync({ force: true }); // `force: true` drops and recreates the table
    console.log('Todos table created successfully.');
  } catch (error) {
    console.error('Error syncing database:', error);
  } finally {
    await sequelize.close(); // Close the connection
  }
})();
