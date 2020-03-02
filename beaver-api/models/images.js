module.exports = (sequelize, DataType) => {
  const Images = sequelize.define("Images", {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    image: {
      type: DataType.TEXT('long'),
      allowNull: true
    }
  }, {
    classMethods: {
      associate: (models) => {
        Images.belongsTo(models.ServiceProviders);
      }
    }
  });
  return Images;
};
