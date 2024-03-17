const { convertDate } = require("../utils/convertDate");
const dbChatroom = include("database/chatroom");

const getRoom = async (req, res) => {
    const roomID = req.query.roomID;
    const userID = req.session.user_id;

    const emojis = await dbChatroom.getEmojis({
        roomID: roomID,
    });

    console.log(roomID);

    const roomMessages = await dbChatroom.getroomMessages({
        roomID: roomID,
    });

    console.log(roomMessages);

    const membersInRoom = await dbChatroom.getMembersInRoom({
        roomID: roomID,
    });

    const membersToInvite = await dbChatroom.getMembersToInvite({
        roomID: roomID,
    });

    return res.render(`chatroom/chatroom`, {
        roomID: roomID,
        emojis: emojis,
        messages: roomMessages,
        currentUserID: userID,
        membersInRoom: membersInRoom,
        membersToInvite: membersToInvite,
    });
};

const getRooms = async (req, res) => {
    const userID = req.session.user_id;
    const userrooms = await dbChatroom.getRooms(userID);

    let roomInfo = [];
    console.log(userID);
    console.log(userrooms);

    for (const room of userrooms) {
        let [roomDetails, roomFields] = await dbChatroom.getRoom({
            roomID: room.room_id,
        });

        let [sentDatetime, sentDateFields] =
            await dbChatroom.getRecentroomMessage({
                roomID: room.room_id,
            });

        let [unreadMessages, unreadMessageFields] =
            await dbChatroom.getUnreadMessages({
                roomID: room.room_id,
            });

        let lastReadMessageDateConverted = convertDate(
            sentDatetime.sent_datetime
        );

        let unreadMessagesCount = unreadMessages?.num_messages_behind ?? 0;

        roomInfo.push({
            name: roomDetails.name,
            roomID: room.room_id,
            startDate: roomDetails.start_datetime,
            unreadMessages: unreadMessagesCount,
            lastReadMessageDateConverted: lastReadMessageDateConverted,
        });
    }

    return res.render("chatroom/rooms", { rooms: roomInfo });
};

const postInviteNewMember = async (req, res) => {
    const { members, roomID } = req.body;

    try {
        await dbChatroom.inviteNewMember({
            members: members,
            roomID: roomID,
        });

        return res.json({ status: "Successfully invited all users!" });
    } catch (error) {
        return res, json({ status: "Failed to Invite user" });
    }
};

const postMessageReactEmoji = async (req, res) => {
    const { emojiName, emojiID, messageID, userID } = req.body;

    try {
        await dbChatroom.updateMessageReact({
            emojiName: emojiName,
            emojiID: emojiID,
            messageID: messageID,
            userID: userID,
        });

        return res.json({ status: "Successfully reacted to message" });
    } catch (error) {
        console.log(error);
        return res.json({ status: "Failed to react to emoji" });
    }
};

const postCreateNewRoom = async (req, res) => {
    const userID = req.session.user_id;
    const { roomName } = req.body;

    try {
        await dbChatroom.createNewRoom({
            roomName: roomName,
            userID: userID,
        });

        return res.json({ status: "Successfully created new room" });
    } catch (error) {
        console.log(error);
        return res.json({ status: "Failed to react to emoji" });
    }
};
module.exports = {
    getRooms,
    getRoom,
    postInviteNewMember,
    postMessageReactEmoji,
    postCreateNewRoom,
};
