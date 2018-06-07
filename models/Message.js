/**
 * Message model for messages
 * Each message container:
 *  id (primary)
 *  content
 *  authorId (foreign key)
 *  chatroomId (foreign key)
 */

/**
 * * Select only the n most recent
 * model.findOne({
 *  limit: n,
 *  where: {
 *    ...
 *  },
 *  order: [ [ 'createdAt', 'DESC' ]],
 * });
 *
 */

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  Message.associate = models => {
    Message.belongsTo(models.User);
    Message.belongsTo(models.Channel);
  };

  return Message;
};
