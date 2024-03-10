require('dotenv').config()

module.exports = {
    secret: process.env.SECRET_TOKEN,
    // jwtExpiration: 3600,         // 1 hour
    // jwtRefreshExpiration: 86400, // 24 hours

    /* for test */
    jwtExpiration: 60 * 60 * 24 * 1, // 1 Days
    // jwtRefreshExpiration: 60 * 60 * 24 * 7, // 7 days
    jwtRefreshExpiration: 60 * 60 * 24 * 7, // 7 Days
};