module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        userId: {
            type: Sequelize.STRING,
            unique: true,
            primaryKey: true
        },
        username: {
            type: Sequelize.STRING,
            unique: true
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
        },
        password: {
            type: Sequelize.STRING
        },
        publicKeyPath: {
            type: Sequelize.STRING
        },
        privateKeyPath: {
            type: Sequelize.STRING
        },
    });

    return User;
};