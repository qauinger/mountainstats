import fs from 'fs';

import express from 'express';
import useragent from 'express-useragent';
import expressLayouts from 'express-ejs-layouts';
import path from 'path';

const app = express();
const port = 5501;

var __dirname = path.resolve();

var mountains = null;

app.use(express.static('public'))

app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.set('view engine', 'ejs');

app.use(useragent.express());

app.get('', async (req, res) => {
    res.render('home', {
            css: css(req),
            title:'MountainStats',
            mountains: mountains
    });
});

app.get('/about', (req, res) => {
    var info = JSON.parse(fs.readFileSync(`package.json`).toString());
    res.render('about', {
            css: css(req),
            title:'MountainStats | About',
            name: info['name'],
            version: info['version']
    });
});

app.get('/prefs', (req, res) => {
    res.render('prefs', {
            css: css(req),
            title:'MountainStats | Preferences'
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', {
            css: css(req),
            title:'MountainStats | Contact'
    });
});

app.get('/legal', (req, res) => {
    res.render('legal', {
            css: css(req),
            title:'MountainStats | Legal'
    });
});

app.get('/m/:mtn', async (req, res) => {
    try {
        var mtn = req.params.mtn;
        var file = fs.readFileSync(`public/mountains/${mtn}/${mtn}.json`);
        var status = fs.readFileSync(`public/mountains/${mtn}/status.json`);
        res.render('render', {
                css: css(req),
                title:`MountainStats | ${mountains[mtn]['name']}`,
                mountain: mtn, 
                mtninfo: JSON.parse(file.toString())[mtn],
                mtnstatus: JSON.parse(status.toString()),
                lastChecked: new Date(JSON.parse(status.toString())['lastChecked'] * 1000).toLocaleString()
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

app.get('/public/*', (req, res) => {
    res.sendFile(`${__dirname}${req.path}`);
});

app.get('*', (req, res) => {
    res.render('404', {
            css: css(req),
            title:'MountainStats | 404'
    });
});

app.listen(port, () => console.info(`Live on port ${port}.`));

fs.readFile('public/mountains/mountains.json', 'utf8', function (err, data) {
    if (err) throw err;
    mountains = JSON.parse(data)['mountains'];
});

function css(req) {
    // return req.useragent.isMobile ? 'mobile.css' : 'desktop.css';
    return 'desktop.css';
}

function update() {
    updateStatuses();
    updateLog();
}

update();

setInterval(function() {
    update();
}, 5 * 60 * 1000);

// Update.js // *********************

import fetch from 'node-fetch';

async function getHTML(url) {
    const response = await fetch(url);
    return await response.text();
}

async function updateStatuses() {
    var mountains;
    fs.readFile('public/mountains/mountains.json', 'utf8', function (err, data) {
        if (err) throw err;
        mountains = JSON.parse(data)['mountains'];
        Object.keys(mountains).forEach(mountain => {
            updateStatus(mountain);
        });
    });
}

async function updateStatus(mountain) {
    try {
        var config;
        var status;
        fs.readFile(`public/mountains/${mountain}/config.json`, 'utf8', async function (err, configFile) {
            if(err) {
                throw err;
            }
            fs.readFile(`public/mountains/${mountain}/status.json`, 'utf8', async function (err, statusFile) {
                if(err) {
                    fs.writeFileSync(`public/mountains/${mountain}/status.json`, "{\"trails\":{}, \"lifts\":{}}");
                    console.log(`No status.json file for "${mountain}". Creating one (public/mountains/${mountain}/status.json)`);
                    updateStatus(mountain);
                    return;
                }
                config = JSON.parse(configFile)[mountain];
                status = JSON.parse(statusFile);
                var html = await getHTML(config['url']);
                html = html.replace(/<[^>]*>?/gm, '');
                
                var trails = config['trails'];
                Object.keys(trails).forEach(trail => {
                    var open_regex = trails[trail]['open_regex'];
                    var closed_regex = trails[trail]['closed_regex'];

                    if(html.match(open_regex) !== null) {
                        status['trails'][trail] = 1;
                    } else if(html.match(closed_regex) !== null) {
                        status['trails'][trail] = 0;
                    } else {
                        console.log(`(${mountain}) ${trail} = UNKNOWN`);
                        status['trails'][trail] = -1;
                    }
                });

                var lifts = config['lifts'];
                Object.keys(lifts).forEach(lift => {
                    var open_regex = lifts[lift]['open_regex'];
                    var closed_regex = lifts[lift]['closed_regex'];

                    if(html.match(open_regex) !== null) {
                        status['lifts'][lift] = 1;
                    } else if(html.match(closed_regex) !== null) {
                        status['lifts'][lift] = 0;
                    } else {
                        console.log(`(${mountain}) ${lift} = UNKNOWN`);
                        status['lifts'][lift] = -1;
                    }
                });

                status['lastChecked'] = Math.floor(new Date().getTime() / 1000);

                fs.writeFileSync(`public/mountains/${mountain}/status.json`, JSON.stringify(status, null, 4));
                console.log(`Updated status of "${mountain}"`);
            });
        });
    } catch(err) {
        console.log(`Error. Unable to update the status of "${mountain}". Trace: ${err}`);
        return;
    }
}

async function updateLog() {
    fs.appendFile('updater.log', `${new Date().toLocaleString('en-US', {hour12: false})}\n`, function (err) {
        if (err) throw err;
    });
}
