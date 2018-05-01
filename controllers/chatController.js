const { Channel } = require('../models');

exports.channelExists = async (req, res, next) => {
  // check if channel already exists
  /* const channel = await Channel.findOne({});
  if (channel) {
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
  const chat = await Channel.findById(req.params.id);
  res.render('chat', { title: 'Chat with ....' });
};
