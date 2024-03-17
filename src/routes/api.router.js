const { Router } = require("express");
const { postUser } = require("../controllers/userController");
const { postLogin, postSignout } = require("../controllers/authController");
const {
    postInviteNewMember,
    postCreateNewRoom,
    postMessageReactEmoji,
} = require("../controllers/chatroomController");

const apiRouter = () => {
    const router = Router();

    router.post("/submitUser", postUser);
    router.post("/loggingin", postLogin);
    router.get("/signout", postSignout);

    router.post("/inviteNewMember", postInviteNewMember);
    router.post("/messageReactEmoji", postMessageReactEmoji);
    router.post("/createNewRoom", postCreateNewRoom);

    return router;
};

module.exports = { apiRouter };
