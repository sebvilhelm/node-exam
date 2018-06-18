const { Channel, User, Message, Sequelize } = require('../models');

const $ = Sequelize.Op;

exports.getGlobalChat = async (req, res) => {
  // 1. get all messages
  const channel = await Channel.findOne({ where: { id: 1 } });
  const messages = await channel.getMessages({ include: [User] });
  // 2. Render the template
  res.render('chat', {
    title: 'Global Chat',
    chat: { id: channel.id, messages },
  });
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
  const channel = await Channel.create();
  await channel.setUsers([req.user.id, req.body.userId]);
  res.redirect(`/chat/${channel.id}`);
};

exports.showChannel = async (req, res) => {
  const channel = await Channel.findOne({
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

  const messages = await channel.getMessages({ include: [User] });

  const {
    id,
    users: [{ name }],
  } = channel;

  res.render('chat', { title: `Chat with ${name}`, chat: { id, messages } });
};

const getUserId = socket => {
  if (
    socket &&
    socket.handshake &&
    socket.handshake.session &&
    socket.handshake.session.passport &&
    socket.handshake.session.passport.user
  ) {
    return socket.handshake.session.passport.user;
  }
  return undefined;
};

exports.getUser = async (socket, next) => {
  const id = getUserId(socket);
  if (!id) {
    next(true);
    return;
  }
  const { name, photo } = await User.findById(id);
  socket.user = {
    id,
    name,
    photo,
  };
  next();
};

exports.addMessage = async ({ userId, channelId, content }) => {
  const message = new Message({ content });
  await Promise.all([message.setUser(userId, { save: false }), message.setChannel(channelId, { save: false })]);
  return message.save();
};

exports.getUsersChannels = async (req, res) => {
  const user = await User.findById(req.user.id);
  const channels = await user.getChannels({
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
  res.render('chatList', { title: 'My chats', channels });
};
