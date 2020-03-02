module.exports = (sequelize, DataType) => {
  const ServiceProviders = sequelize.define("ServiceProviders", {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    description: {
      type: DataType.STRING,
      allowNull: true
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
    }
  }, {
    classMethods: {
      associate: (models) => {
        ServiceProviders.belongsTo(models.Users);
        ServiceProviders.belongsTo(models.Services);
        ServiceProviders.hasMany(models.ServiceRequests);
      }
    }
  });
  return ServiceProviders;
};
