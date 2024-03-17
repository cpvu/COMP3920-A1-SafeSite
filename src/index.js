require("./utils");

require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");

const database = include("databaseConnection");
const db_utils = include("database/db_utils");
const db_users = include("database/users");
const success = db_utils.printMySQLVersion();

const { clientRouter } = require("./routes/client.router");
const { apiRouter } = require("./routes/api.router");
const { chatroomRouter } = require("./routes/chatroom.router");

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

/* secret information section */
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;

const node_session_secret = process.env.NODE_SESSION_SECRET;
/* END secret section */

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));

var mongoStore = MongoStore.create({
    mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@cluster0.nzw5tjz.mongodb.net/sessions`,
    crypto: {
        secret: mongodb_session_secret,
    },
});

app.use(
    session({
        secret: node_session_secret,
        store: mongoStore, //default is memory store
        saveUninitialized: false,
        resave: true,
    })
);

app.use("/", clientRouter());
app.use("/api", apiRouter());
app.use("/chatroom", chatroomRouter());

app.use(express.static(__dirname + "/public"));

app.get("*", (req, res) => {
    res.status(404);
    res.render("404");
});

const create_tables = include("database/create_tables");
create_tables.createTables();

app.listen(port, () => {
    console.log("Node application listening on port " + port);
});
