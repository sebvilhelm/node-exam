const { Channel, User, Sequelize } = require('../models');

const $ = Sequelize.Op;

exports.getGlobalChat = (req, res) => {
  // 1. get all messages
  // 2. Render the template
  res.render('chat', { title: 'Global Chat', chat: { id: 1 } });
};

exports.channelExists = async (req, res, next) => {
  // check if channel already exists

  /* if (channel) {
    res.redirect(`chat/${channel.id}`);
    return;
  } */
  next();
};

exports.addChannel = async (req, res) => {
  const channel = new Channel();
  await channel.save();
  await channel.addUsers([req.user.id, req.body.userId]);
  res.redirect(`/chat/${channel.id}`);
};

exports.showChannel = async (req, res) => {
  // TODO: get all messages belonging to the channel
  const chat = await Channel.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: User,
        where: {
          id: {
            [$.ne]: req.user.id,
          },
        },
      },
    ],
  });

  const {
    users: [{ name }],
  } = chat;

  res.render('chat', { title: `Chat with ${name}`, chat });
};

exports.addMessage = (req, res) => {
  res.json(req.body);
};
