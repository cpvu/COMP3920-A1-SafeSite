function isAdmin(req) {
  if (req.session.user_type == "admin") {
    return true;
  }
  return false;
}

module.exports = { isAdmin };
