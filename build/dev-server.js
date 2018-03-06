#!/usr/bin/env node

var pkg = require('../package')

// Serve development assets - compile jade/stylus on demand
var express = require('express')

var pug = require('pug')
var stylus = require('stylus')
var nib = require('nib')
var fs = require('fs')
var url = require('url')
var depsBlob = require('./browserify-client-deps')
var router = express.Router()

var configPath = require('./get-config-path')

router.get('/', function(req, res) {
    var u = url.parse(req.url, true);
    fs.readFile('./src/index.pug', function(err, template) {
        if (err) { console.error(err); res.writeHead(500); return res.end(); }
        res.end(pug.render(template, { mode: u.query.mode || 'web', filename: './src/index.pug', pkg: pkg }));
    });
});

router.get(/^\/css\/(.*).css/, function(req, res, next) {
    var pathname = url.parse(req.url).pathname.slice('/css/'.length);
    var styl_file = pathname.replace('.css', '.styl');
    var p = (pathname.indexOf('/') === -1 ? './src/styl/' : './') + styl_file; // put /styl in front if it's top-level
    fs.readFile(p, function(err, str) {
        if (err) { console.error(err); return next(); }
        stylus(str.toString()).set('filename', p).use(nib()).render(serveCss.bind(null, req, res));
    });
});
function serveCss(req, res, err, stylesheets) {
    if (err) { console.error(err); res.writeHead(500); return res.end(); }
    res.writeHead(200, { 'content-type': 'text/css' });
    res.end(stylesheets);
}

router.get('/depsblob.js', function(req, res) {
    depsBlob(configPath).bundle().pipe(res);
});

router.use(require('serve-static')('./'));

// Listen
var app = express()
var server = app.listen(8090)

app.use(router)

server.on('listening', function() {
     console.log('Development server listening on: '+server.address().port)
})
