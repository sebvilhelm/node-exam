exports.dump = obj => JSON.stringify(obj, null, 2);

exports.dateFns = require('date-fns');

exports.avatar = photo =>
  photo ? (photo.startsWith('http') ? photo : `/uploads/users/${photo}`) : '/images/profile-placeholder.png';
