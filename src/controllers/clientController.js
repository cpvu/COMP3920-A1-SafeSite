const getHome = (req, res) => {
  res.render("index", { authenticated: req.session.authenticated });
};

const getLogin = (req, res) => {
  res.render("login", { user: "" });
};

const getSignup = (req, res) => {
  var { error } = req.query;

  res.render("signup", { error: error });
};

const getContact = (req, res) => {
  var missingEmail = req.query.missing;
  res.render("contact", { missing: missingEmail });
};

const getAbout = (req, res) => {
  var color = req.query.color;
  if (!color) {
    color = "black";
  }

  res.render("about", { color: color });
};

const getLoggedIn = (req, res) => {
  res.render("loggedin");
};

const getMemberHome = (req, res) => {
  const randomImageGenerator = Math.floor(Math.random() * 3);

  res.render("member", {
    username: req.session.username,
    user_type: req.session.user_type,
    cat_number: randomImageGenerator,
  });
};

const getCats = (req, res) => {
  var cat = req.params.id;

  res.render("cat", { cat: cat });
};

const createTables = (req, res) => {
  const create_tables = include("database/create_tables");

  var success = create_tables.createTables();
  if (success) {
    res.render("successMessage", { message: "Created tables." });
  } else {
    res.render("errorMessage", { error: "Failed to create tables." });
  }
};

module.exports = {
  getHome,
  getLogin,
  getContact,
  getAbout,
  getSignup,
  getLoggedIn,
  getMemberHome,
  getCats,
  createTables,
};
