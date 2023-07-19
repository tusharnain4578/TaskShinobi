module.exports = (req, res, next) => {
  if (req.session.userLoggedIn && req.session.user) {
    req.user = req.session.user;
    return next();
  }
  return res.status(401).send({
    error: true,
    message: "Authentication Failed",
  });
};
