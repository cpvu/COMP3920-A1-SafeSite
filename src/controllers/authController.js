const db_users = include("database/users");
const bcrypt = require("bcrypt");
const expireTime = 24 * 60 * 60 * 1000; //expires after 1 da

const postLogin = async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    var results = await db_users.getUser({
        username: username,
    });

    if (results) {
        if (results.length == 1) {
            //there should only be 1 user in the db that matches
            if (bcrypt.compareSync(password, results[0].password)) {
                req.session.authenticated = true;
                req.session.user_type = results[0].type;
                req.session.username = username;
                req.session.cookie.maxAge = expireTime;
                req.session.user_id = results[0].user_id;

                console.log(req.session.user_id);

                return res.redirect("/member");
            } else {
                console.log("invalid password");
            }
        } else {
            console.log(
                "invalid number of users matched: " +
                    results.length +
                    " (expected 1)."
            );
            res.redirect("/login");
            return;
        }
    }

    console.log("user not found");
    //user and password combination not found
    res.redirect("/login");
};

const postSignout = async (req, res) => {
    if (req.session.authenticated) {
        req.session.destroy();
        return res.redirect("/login");
    }
};

module.exports = { postLogin, postSignout };
