module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define("messages", {
        sender: {
            type: Sequelize.STRING,
        },
        receiver: {
            type: Sequelize.STRING,
        },
        message: {
            type: Sequelize.TEXT,
        },
        type: {
            type: Sequelize.STRING,
        },
        passhraseHash: {
            type: Sequelize.TEXT,
        },
        encKey: {
            type: Sequelize.TEXT,
        },
    });

    return Message;
};