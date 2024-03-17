const { Router } = require("express");
const { sessionValidation } = require("../middleware/sessionValidation");

const { getRooms, getRoom } = require("../controllers/chatroomController");

const chatroomRouter = () => {
    const router = Router();

    //   router.use("/rooms", sessionValidation);

    router.get("/rooms", getRooms);
    router.get("/rooms/:roomID", getRoom);

    return router;
};

module.exports = { chatroomRouter };
