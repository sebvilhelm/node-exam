exports.catchErrors = fn =>
  function(req, res, next) {
    return fn(req, res, next).catch(next);
  };

exports.displayError = (err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    title: 'Error',
    err,
  });
};
