const existingUsers = {
    create_dm_test: {
        name: process.env.CREATE_DM_TEST_USER,
        passphrase: process.env.CREATE_DM_TEST_PASS
    },
    chat_recipient: {
        name: process.env.CHAT_RECIPIENT_USER,
        passphrase: process.env.CHAT_RECIPIENT_PASS
    },
    room_test: {
        name: process.env.CREATE_ROOM_TEST_USER,
        passphrase: process.env.CREATE_ROOM_TEST_PASS
    },
    doctor: {
        name: process.env.MCR_DOCTOR_USER,
        passphrase: process.env.MCR_DOCTOR_PASS
    }
};

module.exports = { existingUsers };
