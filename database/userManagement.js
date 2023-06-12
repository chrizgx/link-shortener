const pool = require("../config/db");

// Return the first line of results.rows. If it does not exist,
// it means there is no user with such credentials
const getUserByUsernameAndPassword = async (username, password) => {
    try {
        const results = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND password = $2',
            [username, password],
        );

        return results.rows[0];
    } catch (e) {
        console.error(e);
        return null;
    }
};

// Return true if username is taken, otherwise return false
const usernameAlreadyExists = async (username) => {
    try {
        const results = await pool.query(
            'SELECT * FROM users WHERE username = $1;',
            [username]
        );
        return results.rowCount !== 0;
    } catch (e) {
        console.error(e);
        return true;
    }
}

// Create a new user after checking username availability.
// Return new user data.
const createUser = async (username, password) => {
    try {
        if (await usernameAlreadyExists(username)) {
            return null;
        }
        
        const results = await pool.query(
            'INSERT INTO users(username, password) VALUES ($1, $2) RETURNING id, username;',
            [username, password]
        );

        return results.rows[0];
    } catch (e) {
        console.error(e);
        return null;
    }
}


module.exports = {
    getUserByUsernameAndPassword,
    usernameAlreadyExists,
    createUser
};