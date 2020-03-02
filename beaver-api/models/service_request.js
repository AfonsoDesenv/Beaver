module.exports = (sequelize, DataType) => {
  const ServiceRequests = sequelize.define("ServiceRequests", {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // 1 - opened / 2 - accepted / 3 - refused / 4 - concluded / 5 - canceled
    status: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    classMethods: {
      associate: (models) => {
        ServiceRequests.belongsTo(models.Users);
        ServiceRequests.belongsTo(models.ServiceProviders);
        ServiceRequests.hasOne(models.Ratings);
      }
    }
  });
  return ServiceRequests;
};
