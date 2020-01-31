/* eslint-disable no-param-reassign */
const { crypto } = require('../../services');

module.exports = (sequelize, dataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        field: 'id',
        type: dataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        field: 'username',
        unique: true,
        type: dataTypes.STRING,
        allowNull: true
      },
      password: {
        field: 'password',
        type: dataTypes.STRING,
        allowNull: false
      },
      salt: {
        field: 'salt',
        type: dataTypes.STRING,
        allowNull: true
      },
      firstName: {
        field: 'first_name',
        type: dataTypes.STRING,
        allowNull: false
      },
      lastName: {
        field: 'last_name',
        type: dataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: 'user',
      freezeTableName: true,
      underscored: true,
      hooks: {
        beforeCreate: user => {
          const { hash, salt } = crypto.createPasswordHash(user.password);
          user.salt = salt;
          user.password = hash;
        },
        beforeUpdate: user => {
          if (user.changed('password')) {
            const { hash, salt } = crypto.createPasswordHash(user.password);
            user.password = hash;
            user.salt = salt;
          }
        }
      }
    }
  );

  User.associate = models => {
    User.hasMany(models.RefreshToken, {
      as: 'refreshTokens',
      foreignKey: 'userId'
    });
  };

  User.authenticate = async function authenticate(username, password) {
    const user = await User.findOne({
      where: {
        username
      }
    });

    if (!user) {
      return null;
    }

    const { hash } = crypto.createPasswordHash(password, user.salt);
    if (hash === user.password) {
      return user;
    }
    return null;
  };

  return User;
};
