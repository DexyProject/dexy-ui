var pkg = require('./package')

// Serve development assets - compile jade/stylus on demand

var jade = require('jade')
var stylus = require('stylus')
var nib = require('nib')
var fs = require('fs')
var url = require('url')
var depsBlob = require('./browserify-client-deps')

router.get('/', function(req, res) {
    var u = url.parse(req.url, true);
    fs.readFile('./index.jade', function(err, template) {
        if (err) { console.error(err); res.writeHead(500); return res.end(); }
        res.end(jade.render(template, { mode: u.query.mode || 'web', filename: './index.jade', pkg: pkg }));
    });
});

router.get(/\/css\/(.*).css/, function(req, res, next) {
    var pathname = url.parse(req.url).pathname.slice('/css/'.length);
    var styl_file = pathname.replace('.css', '.styl');
    var p = (pathname.indexOf('/') === -1 ? './styl/' : './') + styl_file; // put /styl in front if it's top-level
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
    depsBlob().bundle().pipe(res);
});

router.use(require('serve-static')('./'));


