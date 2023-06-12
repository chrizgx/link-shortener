const express = require('express');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// INITIATE AUTHENTICATION
const pgSession = require('connect-pg-simple')(session);
const pool = require("./config/db");

app.use(
    session({
        store: new pgSession({
            pool: pool
        }),
        secret: process.env.SECRET,
        saveUninitialized: false,
        resave: false,
        cookie: {
            secure: false,
            httpOnly: false,
            sameSite: false,
            maxAge: 1000 * 60 *60 * 1.5
        },
    })
);

// Serve public files from 'assets' folder
app.use('/assets', express.static('./assets'));

app.get('/', async (req, res) => {
    res.redirect('/app');
});

const appDB = require("./database/links");

app.all('/:key', async (req, res, next) => {
    const key = req.params.key;
    
    if (key == "app" || key == "404") {
        return next();
    }

    const link = await appDB.getLinkDetails(key);

    if (link == null) {
        // return res.redirect('/404');
        return next();
    }

    if (link.intersitial) {
        return res.redirect(`/safe/${key}`);
    }
    
    res.redirect(link.url);
});

app.all('/safe/:key', async (req, res, next) => {
    const key = req.params.key;
    if (key == "app" || key == "404") {
        return next();
    }

    const link = await appDB.getLinkDetails(key);

    if (link == null) {
        return res.redirect('/404');
    } 

    res.render('pages/intersitial', {
        key: key,
        url: link.url,
        description: link.description,
        intersitial: link.intersitial,
    });
})

const sessionRouter = require("./routers/session");
app.use('/app', sessionRouter);

const appRouter = require("./routers/app");
app.use('/app', sessionRouter.validateCookie, appRouter);

app.use(async (req, res) => {
    res.render('pages/404');
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`App is running on port ${process.env.PORT || 3000}`);
})