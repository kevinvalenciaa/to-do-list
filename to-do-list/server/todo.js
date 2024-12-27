const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize'); // Adjust the path as needed

const Todo = sequelize.define('Todo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false, // Equivalent to "NN" (Not Null)
  },
  task: {
    type: DataTypes.STRING(45), // Equivalent to VARCHAR(45)
    allowNull: false, // Equivalent to "NN"
  },
  createdAt: {
    type: DataTypes.DATE, // Equivalent to "DATE"
    allowNull: true, // Default behavior for nullable
  },
}, {
  tableName: 'todos', // Explicitly define table name
  timestamps: false, // Disable automatic `createdAt` and `updatedAt`
});

module.exports = Todo;
