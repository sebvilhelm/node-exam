const { Channel } = require('../models');

exports.addChat = async (req, res) => {
  const channel = new Channel();
  channel.addUser(req.user.id);
  await channel.save();
  res.redirect(`/chat/${channel.id}`);
};

exports.chat = async (req, res) => {
  const chat = await Channel.findById(req.params.id);
  res.json(chat);
};
