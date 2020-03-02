module.exports = (sequelize, DataType) => {
  const Messages = sequelize.define("Messages", {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    text: {
      type: DataType.STRING,
      allowNull: true
    }
  }, {
    classMethods: {
      associate: (models) => {
        Messages.belongsTo(models.Users,  {
          foreignKey: 'to_id'
        });
        Messages.belongsTo(models.Users, {
          foreignKey: 'from_id'
        });
      }
    }
  });
  return Messages;
};
