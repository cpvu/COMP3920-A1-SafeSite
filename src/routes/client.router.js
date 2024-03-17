const { Router } = require("express");
const {
    getHome,
    getLogin,
    getContact,
    getAbout,
    getSignup,
    getLoggedIn,
    getMemberHome,
    getCats,
    createTables,
} = require("../controllers/clientController");
const { sessionValidation } = require("../middleware/sessionValidation");

const clientRouter = () => {
    const router = Router();

    router.get("/", getHome);
    router.get("/signup", getSignup);
    router.get("/login", getLogin);
    router.get("/contact", getContact);
    router.get("/about", getAbout);

    router.use("/loggedin", sessionValidation);
    router.use("/member", sessionValidation);

    router.get("/loggedin", getLoggedIn);
    router.get("/member", getMemberHome);
    router.get("/cat/:id", getCats);
    router.get("createTables", createTables);

    return router;
};

module.exports = { clientRouter };
