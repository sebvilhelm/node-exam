/*
Chat room model for chat rooms.
Each chat will contain
  id (primary key)

  associations through channelMembers

*/

const schemaOptions = {
  timestamps: false,
};

module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define(
    'channel',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    schemaOptions
  );

  Channel.associate = models => {
    Channel.belongsToMany(models.User, { through: 'channel_members' });

    Channel.hasMany(models.Message);
  };

  return Channel;
};
