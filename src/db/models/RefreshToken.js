/* eslint-disable no-param-reassign */
const { crypto } = require('../../services');

module.exports = (sequelize, dataTypes) => {
  const RefreshToken = sequelize.define(
    'RefreshToken',
    {
      id: {
        field: 'id',
        type: dataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      token: {
        field: 'token',
        type: dataTypes.STRING,
        allowNull: false
      },
      expiresAt: {
        field: 'expires_at',
        type: dataTypes.DATE,
        allowNull: false
      },
      userId: {
        field: 'user_id',
        type: dataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'user',
          key: 'id'
        }
      }
    },
    {
      tableName: 'refresh_token',
      freezeTableName: true,
      underscored: true,
      hooks: {
        beforeCreate: refreshToken => {
          refreshToken.token = crypto.hash('sha256', refreshToken.token);
        },
        beforeFind: options => {
          if (options.where) {
            if (options.where.token) {
              options.where.token = crypto.hash('sha256', options.where.token);
            }
          }
        },
        beforeBulkDestroy: options => {
          if (options.where) {
            if (options.where.token) {
              options.where.token = crypto.hash('sha256', options.where.token);
            }
          }
        }
      }
    }
  );

  RefreshToken.associate = models => {
    RefreshToken.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      targetKey: 'id'
    });
  };

  return RefreshToken;
};
