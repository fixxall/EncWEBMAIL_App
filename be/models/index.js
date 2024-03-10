const config = require("../configs/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD, {
        host: config.HOST,
        dialect: config.dialect,
        dialectOptions: config.dialectOptions,
        timezone: config.timezone,
        logging: false,
        define: {
            collate: config.collate,
            charset: config.charset,
        }
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.message = require("../models/message.model.js")(sequelize, Sequelize);
db.attachment = require("../models/attachment.model.js")(sequelize, Sequelize);
const AttachmentMessage = sequelize.define('attachments_message', {}, { timestamps: false });
db.attachmentmessage = AttachmentMessage;
db.attachment.belongsToMany(db.message, { through: AttachmentMessage });
db.message.belongsToMany(db.attachment, { through: AttachmentMessage });


// db.bureau.hasMany(db.title);
// db.title.belongsTo(db.bureau);

// db.organization.hasMany(db.bureau);
// db.bureau.belongsTo(db.organization);

module.exports = db;