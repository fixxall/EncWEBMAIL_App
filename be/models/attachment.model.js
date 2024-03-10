module.exports = (sequelize, Sequelize) => {
    const Attachment = sequelize.define("attachments", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        file: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    return Attachment;
};