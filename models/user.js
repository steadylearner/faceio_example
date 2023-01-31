'use strict';
const {
  Model, UUIDV4
} = require('sequelize');

// Test with this
// https://www.npmjs.com/package/sequelize-test-helpers
// https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    facialId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,

      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,

      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,

      validate: {
        notEmpty: true,
        isEmail: true,
        isLowercase: true,
      },
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};