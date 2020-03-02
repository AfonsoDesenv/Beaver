module.exports = (sequelize, DataType) => {
  const Services = sequelize.define("Services", {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataType.STRING(100),
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    classMethods: {
      associate: (models) => {
        Services.hasMany(models.ServiceProviders);
      }
    }
  });
  return Services;
};
