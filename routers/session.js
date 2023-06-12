const express = require('express');
const router = express.Router();
const userManagement = require("../database/userManagement");

router.validateCookie = async (req, res, next) => {
    try {
        if (req.sessionID && req.session.user) return next();
        return res.redirect('/logout');
    } catch (e) {
        console.error(e);
        res.redirect('/');
    }
}

router.get('/', async (req, res) => {
    try {
        res.redirect('/app/login');
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
})

router.get('/login', async (req, res) => {
    try {
        // Check whether user is already logged in.
        // If yes, redirect them to dashboard page.
        if (req.sessionID && req.session.user) {
            return res.redirect('/app/dashboard');
        }
        // Otherwise, serve the login page.
        res.sendFile('/assets/login/index.html', {root: './'});
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
})

router.post('/login', async (req, res) => {
    let { username, password } = req.body;
    username = username.toLowerCase();
    console.log(`New login attempt: ${username}`);

    if (username == null || password == null) {
        return res.sendStatus(403)
    }

    try {
        // Validate credentials through database
        const user = await userManagement.getUserByUsernameAndPassword(username, password);
        console.log(user);
        if (!user) return res.redirect('/app/login');

        // create new session
        req.session.user = {
            id: user.id,
            username: user.username
        };

        res.status(200);
        return res.redirect('/app/dashboard');

    } catch (e) {
        console.error(e);
        return res.sendStatus(403);
    }
});

router.get('/signup', async (req, res) => {
    try {
        // Redirect to dashboard if already logged in.
        if (req.sessionID && req.session.user) {
            return res.redirect('/app/dashboard');
        }
        // ...
        res.sendFile('/assets/signup/index.html', {root: './'});
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
})

router.post('/signup', async (req, res) => {
    try {
        let { username, password } = req.body;
        username = username.toLowerCase();
        console.log(`New User registering with username ${username} and password: ${password}`);

        if (username == null || password == null || await userManagement.usernameAlreadyExists(username)) {
            console.log('DENIED')
            return res.status(403).redirect('/signup');
        }
        
        // Create user, then fetch credentials to simulate a login.
        const user = await userManagement.createUser(username, password);
        console.log(user);
        if (!user) return res.redirect('/app/signup');

        req.session.user = {
            id: user.id,
            username: user.username
        }

        res.status(200);
        return res.redirect('/app/dashboard');
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
})

router.get('/logout', async (req, res) => {
    try {
        // Delete session token from database.
        await req.session.destroy();
        return res.redirect('/app/login');
    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
})

module.exports = router;