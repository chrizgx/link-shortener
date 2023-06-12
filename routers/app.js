const express = require('express');
const router = express.Router();

const appDB = require('../database/links');

router.get('/dashboard', async (req, res) => {
    try {
        
        const links = await appDB.getUserLinks(req.session.user.id);

        if (links != null) {

            return res.render('pages/dashboard_links', {
                links: links
            });

        }

        res.render('pages/dashboard');

    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

router.post('/generate', async (req, res) => {
    try {

        const userId = req.session.user.id;

        var { key, description, url, intersitial } = req.body;
        console.log(req.body);

        if (key == undefined || description == undefined || url == undefined) {
            return res.sendStatus(403);
        }

        intersitial = intersitial == 'on' ? true : false;

        await appDB.createLink(userId, key, description, url, intersitial);
        
        return res.redirect('/app');


    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
})

router.post('/delete-link', async (req, res) => {

    try {

        const userId = req.session.user.id;
        const { id } = req.body;
    
        if (!id) {
            return res.sendStatus(404);
        }
    
        const response = await appDB.deleteLink(userId, id);
        const code = response == 1 ? 200 : 404;
        res.sendStatus(code);

    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }

});

module.exports = router;