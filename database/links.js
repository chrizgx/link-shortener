const pool = require("../config/db");


const getLinkDetails = async (key) => {
    try {
        const results = await pool.query(
            'SELECT * FROM links WHERE key = $1;',
            [key]
        );

        return results.rowCount == 1 ? results.rows[0] : null;
    } catch (e) {
        console.error(e);
        return null;
    }
}

const createLink = async (userId, key, description, url, intersitial) => {
    try {
        const results = await pool.query(
            'INSERT INTO links(user_id, name, description, url, intersitial) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
            [userId, key, description, url, intersitial]
        );

        return results.rows[0];
    } catch (e) {
        console.error(e);
        return null;
    }
}

const linkIsAvailable = async (key) => {
    try {
        const results = await pool.query(
            'SELECT * FROM links WHERE key = $1;',
            [key]
        );

        return results.rowCount == 0;
    } catch (e) {
        console.error(e);
        return false;
    }
}

const deleteLink = async (userId, key) => {
    try {
        const results = await pool.query(
            'DELETE FROM links WHERE user_id = $1 AND key = $2;',
            [userId, key]
        );

        return results.rowCount == 1;
    } catch (e) {
        console.error(e);
        return false;
    }
}

module.exports = {
    getLinkDetails,
    createLink,
    linkIsAvailable,
    deleteLink
}