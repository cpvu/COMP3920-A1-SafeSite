const db = include("databaseConnection");

async function getRoomID(postData) {
    const params = {
        roomName: roomName,
    };

    const getRoomIDQuery = `SELECT R.room_id
FROM room R
WHERE R.name = :roomName;`;

    try {
        const [results, fields] = await db.query(getRoomIDQuery, params);

        return results;
    } catch (error) {
        console.log(error);
    }
}

async function getRecentroomMessage(postData) {
    const params = {
        roomID: postData.roomID,
    };

    const getRecentroomMessageQuery = `SELECT sent_datetime
FROM room_user RU
JOIN message M ON M.room_user_id = RU.room_user_id
WHERE RU.room_id = :roomID
ORDER BY M.sent_datetime asc
LIMIT 1`;

    try {
        const [results, fields] = await db.query(
            getRecentroomMessageQuery,
            params
        );

        return results;
    } catch (error) {
        console.log(error);
    }
}

async function getUnreadMessages(postData) {
    const params = {
        roomID: postData.roomID,
    };

    const getUnreadMessagesQuery = `SELECT U.user_id, RU.room_id, count(*) as num_messages_behind
FROM user U JOIN room_user RU ON U.user_id = RU.user_id 
JOIN (
	SELECT message_id, RU2.room_id
    FROM message M JOIN room_user RU2 on M.room_user_id = RU2.room_user_id
    AND message_id > RU2.last_read_message_id
    ORDER BY RU2.room_id
    ) as unread_message_per_room on unread_message_per_room.room_id = RU.room_id
WHERE RU.room_id = :roomID
GROUP BY U.user_id, RU.room_id`;

    try {
        const [results, fields] = await db.query(
            getUnreadMessagesQuery,
            params
        );

        return results;
    } catch (error) {
        console.log(error);
    }
}

async function getRooms(userID) {
    const params = {
        userID: userID,
    };

    let getroomsQuery = `SELECT user_id, room_id
    FROM room_user RU
    WHERE RU.user_id = :userID`;

    try {
        const [results, fields] = await db.query(getroomsQuery, params);

        return results;
    } catch (error) {
        console.log(error);
    }
}

async function getRoom(postData) {
    const params = {
        roomID: postData.roomID,
    };

    let getroomQuery = `SELECT name, start_datetime
    FROM room 
    WHERE room_id = :roomID`;

    try {
        const [results, fields] = await db.query(getroomQuery, params);
        return results;
    } catch (error) {
        console.log(error);
    }
}

async function getroomMessages(postData) {
    const params = {
        roomID: postData.roomID,
    };

    let getroomMessagesQuery = `
SELECT 
    U.user_id, 
    M.message_id, 
    RU.last_read_message_id, 
    U.username, 
    M.text, 
    M.sent_datetime,
    COUNT(DISTINCT CASE WHEN MR.emoji_id = 1 THEN MR.message_reaction_id END) AS thumbemoji,
    COUNT(DISTINCT CASE WHEN MR.emoji_id = 2 THEN MR.message_reaction_id END) AS hundredemoji,
    COUNT(DISTINCT CASE WHEN MR.emoji_id = 3 THEN MR.message_reaction_id END) AS happyemoji,
    COUNT(DISTINCT MR.message_reaction_id) AS total_reactions
FROM 
    room_user RU
JOIN 
    user U ON U.user_id = RU.user_id
JOIN 
    message M ON M.room_user_id = RU.room_user_id
LEFT JOIN 
    message_reactions MR ON M.message_id = MR.message_id
WHERE 
    RU.room_id = :roomID
GROUP BY 
    M.message_id, U.user_id, RU.last_read_message_id, U.username, M.text, M.sent_datetime
ORDER BY 
    M.message_id ASC;
`;

    try {
        const [results, fields] = await db.query(getroomMessagesQuery, params);
        return results;
    } catch (error) {
        console.log(error);
    }
}

async function getMembersInRoom(postData) {
    let params = {
        roomID: postData.roomID,
    };

    let getMembersInRoomQuery = `SELECT username
FROM user
WHERE user_id IN (
    SELECT user_id
    FROM room_user
    WHERE room_id = :roomID
)
GROUP BY username;
`;

    try {
        const [results, fields] = await db.query(getMembersInRoomQuery, params);
        return results;
    } catch (error) {
        console.log(error);
    }
}

async function getMembersToInvite(postData) {
    let params = {
        roomID: postData.roomID,
    };

    console.log(params);

    let getMembersToInviteQuery = `SELECT username
FROM user
WHERE user_id NOT IN (
    SELECT user_id
    FROM room_user
    WHERE room_id = :roomID
)
GROUP BY username;
`;

    try {
        const [results, fields] = await db.query(
            getMembersToInviteQuery,
            params
        );
        return results;
    } catch (error) {
        console.log(error);
    }
}

async function getEmojis(postData) {
    let params = {
        roomID: postData.roomID,
    };

    let getEmojisQuery = `SELECT emoji_id, name, image
FROM emojis
`;

    try {
        const [results, fields] = await db.query(getEmojisQuery, params);
        return results;
    } catch (error) {
        console.log(error);
    }
}

async function updateMessageReact(postData) {
    let params = {
        emojiName: postData.emojiName,
        emojiID: postData.emojiID,
        messageID: postData.messageID,
        userID: postData.userID,
    };

    let insertMessageReactionQuery = `INSERT INTO message_reactions (emoji_id, message_id, user_id) 
    VALUES(:emojiID, :messageID, :userID)
`;

    try {
        const [results, fields] = await db.query(
            insertMessageReactionQuery,
            params
        );
        return results;
    } catch (error) {
        console.log(error);
    }
}

async function createGroup(postData) {
    let params = {
        roomID: postData.roomID,
    };

    let getMembersToInviteQuery = `SELECT username
FROM user
WHERE user_id NOT IN (
    SELECT user_id
    FROM room_user
    WHERE room_id = :roomID
)
GROUP BY username;
`;

    try {
        const [results, fields] = await db.query(
            getMembersToInviteQuery,
            params
        );
        return results;
    } catch (error) {
        console.log(error);
    }
}

async function inviteNewMember(postData) {
    try {
        for (member of postData.members) {
            const userQuery =
                "SELECT user_id from user WHERE username = :member";

            const [userID] = await db.query(userQuery, {
                member: member,
            });

            console.log(userID);

            let inviteParams = {
                roomID: postData.roomID,
                userID: userID[0].user_id,
            };

            let inviteNewMemberQuery = `
            INSERT INTO room_user (user_id, room_id) VALUES(:userID, :roomID)
            `;

            const [results, fields] = await db.query(
                inviteNewMemberQuery,
                inviteParams
            );

            console.log(`Successfully added ${member}`);
        }

        return true;
    } catch (error) {
        console.log(error);
    }
}

async function createNewRoom(postData) {
    try {
        const params = {
            userID: postData.userID,
            roomName: postData.roomName,
            currentDate: Date.toISOString(),
        };

        const createNewRoomQuery = `INSERT INTO room (name, start_datetime)
        VALUES(:roomName, :currentDate)`;

        const [results, fields] = await db.query(createNewRoomQuery, params);

        const addUserToNewRoom = `INSERT INTO room_user(user_id, room_id, last_unread_message_id) 
        VALUES(:userID, (SELECT room_id FROM room WHERE name = :roomName), (SELECT MAX(message_id) FROM message) )`;

        const [addUserResults, addUserfields] = await db.query(
            createNewRoomQuery,
            params
        );

        console.log(addUserResults);

        console.log(results);
        return true;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getRooms,
    getRoomID,
    getRoom,
    getUnreadMessages,
    getRecentroomMessage,
    getroomMessages,
    getMembersToInvite,
    createNewRoom,
    getMembersInRoom,
    inviteNewMember,
    updateMessageReact,
    getEmojis,
};
