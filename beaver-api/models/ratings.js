module.exports = (sequelize, DataType) => {
  const Ratings = sequelize.define("Ratings", {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rate: {
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    comment: {
      type: DataType.STRING,
      allowNull: true
    }
  }, {
    classMethods: {
      associate: (models) => {
        Ratings.belongsTo(models.ServiceRequests);
      }
    }
  });
  return Ratings;
};
