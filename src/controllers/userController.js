const bcrypt = require("bcrypt");
const saltRounds = 12;
const db_users = include("database/users");
const Joi = require("joi");

const postUser = async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    const passwordSchema = Joi.object({
        password: Joi.string().min(7).pattern(/\d/).required().messages({
            "string.min": "Password must be more than 6 characters long.",
            "string.pattern.base": "Password must include numbers.",
            "any.required": "Password is required.",
        }),
    });

    const { error, value } = passwordSchema.validate({ password: password });

    if (error) {
        console.log(error.details[0].message);
        res.redirect(`/signup?error=${error.details[0].message}`);
        return;
    } else {
        console.log("Password is valid.");
    }

    if (!username && !password) {
        res.redirect("/signup?error=Enter valid user and pass");
    }

    if (!username) {
        res.redirect("/signup?error=Missing Username");
        // res.render("createUser", {error: "Missing Username"})
    }

    if (!password) {
        res.redirect("/signup?error=Missing Password");
    }

    var hashedPassword = bcrypt.hashSync(password, saltRounds);

    var success = await db_users.createUser({
        user: username,
        hashedPassword: hashedPassword,
    });

    if (success) {
        var results = await db_users.getUser({
            user: username,
            password: hashedPassword,
        });

        return res.render("login", { user: username });
    }

    // else {
    //     res.render("errorMessage", {error: "Failed to create user."} );
    // }
};

module.exports = { postUser };
