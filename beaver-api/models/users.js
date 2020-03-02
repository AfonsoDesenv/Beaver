import bcrypt from "bcrypt";

module.exports = (sequelize, DataType) => {
  const Users = sequelize.define("Users", {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    password: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataType.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    latitude: {
      type: DataType.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    longitude: {
      type: DataType.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    picture: {
      type: DataType.TEXT('long'),
      allowNull: true
    }
  }, {
    hooks: {
      beforeCreate: user => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      }
    },
    classMethods: {
      associate: (models) => {
        Users.hasMany(models.ServiceProviders);
        Users.hasMany(models.Messages);
        Users.hasMany(models.ServiceRequests);
      },
      isPassword: (encodedPassword, password) => {
        return bcrypt.compareSync(password, encodedPassword);
      },
      generatePasswordHash: password => {
        const salt = bcrypt.genSaltSync();
        return bcrypt.hashSync(password, salt);
      }
    }
  });
  return Users;
};
